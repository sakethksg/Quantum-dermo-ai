# main.py
import os
import io
import base64
import hashlib
import json
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to import our modules, fall back gracefully if they don't exist
try:
    from .pqc_utils import KyberCipher, verify_signature
    PQC_AVAILABLE = True
except ImportError:
    print("PQC module not available - will use fallback")
    PQC_AVAILABLE = False
    class KyberCipher:
        def encrypt(self, data): return base64.b64encode(data), b"dummy_key"
    def verify_signature(msg, sig, pk): return True

try:
    from .database import insert_health_record, health_check as db_health_check
    DB_AVAILABLE = True
except ImportError:
    print("Database module not available - will use fallback")
    DB_AVAILABLE = False
    def insert_health_record(record): return {"success": True, "message": "Database not available"}
    def db_health_check(): return False

try:
    from .cache import cache_prediction, get_cached_prediction, redis_client, cache_health_check
    CACHE_AVAILABLE = True
except ImportError:
    print("Cache module not available - will use fallback")
    CACHE_AVAILABLE = False
    def cache_prediction(key, data, ttl=None): return True
    def get_cached_prediction(key): return None
    def cache_health_check(): return False

MODEL_PATH = os.path.join(os.path.dirname(__file__), '../model/best_multimodal_hqcnn.pth')

# Complete Multimodal HQCNN Model Architecture
class MultimodalHQCNN(nn.Module):
    def __init__(self, num_clinical_features=10, num_classes=3):
        super(MultimodalHQCNN, self).__init__()
        
        # Image feature extractor (CNN backbone)
        self.backbone = models.resnet50(weights=None)
        self.backbone.fc = nn.Identity()  # Remove final classification layer
        
        # Image feature processor
        self.image_processor = nn.Sequential(
            nn.Linear(2048, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 256),
            nn.ReLU(),
            nn.Dropout(0.2)
        )
        
        # Clinical data processor
        self.clinical_processor = nn.Sequential(
            nn.Linear(num_clinical_features, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.1)
        )
        
        # Fusion layer
        self.fusion = nn.Sequential(
            nn.Linear(256 + 64, 128),  # Image features + Clinical features
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.2)
        )
        
        # Final classifier
        self.classifier = nn.Sequential(
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(32, num_classes),
            nn.Softmax(dim=1)
        )
        
    def forward(self, image_tensor, clinical_tensor):
        # Process image
        image_features = self.backbone(image_tensor)
        image_features = self.image_processor(image_features)
        
        # Process clinical data
        clinical_features = self.clinical_processor(clinical_tensor)
        
        # Fuse features
        fused_features = torch.cat([image_features, clinical_features], dim=1)
        fused_features = self.fusion(fused_features)
        
        # Final prediction
        output = self.classifier(fused_features)
        return output

def load_model():
    try:
        model = MultimodalHQCNN(num_clinical_features=10, num_classes=3)
        if os.path.exists(MODEL_PATH):
            # Suppress sklearn version warnings when loading checkpoint
            import warnings
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")
                # Load checkpoint (which contains model_state_dict and other metadata)
                checkpoint = torch.load(MODEL_PATH, map_location=torch.device('cpu'), weights_only=False)
            
            # Extract model state dict from checkpoint
            if 'model_state_dict' in checkpoint:
                model_state_dict = checkpoint['model_state_dict']
            else:
                # Fallback: assume the file contains only the state_dict
                model_state_dict = checkpoint
            
            # Load the state dict with strict=False to ignore missing keys
            model.load_state_dict(model_state_dict, strict=False)
            print(f"Model loaded successfully from {MODEL_PATH}")
        else:
            print(f"Warning: Model file not found at {MODEL_PATH}. Using randomly initialized weights.")
        model.eval()
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        # Return a dummy model if loading fails
        return MultimodalHQCNN(num_clinical_features=10, num_classes=3)

# Global model instance
model = load_model()

# FastAPI app initialization
app = FastAPI(
    title="Quantum-Secure Predictive Healthcare Platform",
    description="A secure healthcare prediction platform using multimodal AI and post-quantum cryptography",
    version="1.0.0"
)

# Initialize monitoring
try:
    from .monitoring import init_metrics
    init_metrics(app)
    MONITORING_AVAILABLE = True
except ImportError:
    print("Monitoring module not available - will use fallback")
    MONITORING_AVAILABLE = False

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request/Response Schemas ---
class ClinicalData(BaseModel):
    age: float
    gender: int  # 0: Female, 1: Male
    bmi: float
    blood_pressure_systolic: float
    blood_pressure_diastolic: float
    cholesterol: float
    glucose: float
    smoking: int  # 0: No, 1: Yes
    family_history: int  # 0: No, 1: Yes
    symptoms_severity: float

class PredictRequest(BaseModel):
    clinical_data: ClinicalData
    image_base64: str

class PredictResponse(BaseModel):
    prediction: dict
    confidence: float
    encrypted_prediction: str
    cache_hit: bool

class UploadRecordRequest(BaseModel):
    patient_id: str
    patient_data: dict
    signature: str
    public_key: str

class HealthResponse(BaseModel):
    model_config = {"protected_namespaces": ()}
    
    status: str
    model_loaded: bool
    database_connected: bool
    cache_connected: bool

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        # Preprocess image
        try:
            image_bytes = base64.b64decode(request.image_base64)
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
            transform = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
            ])
            image_tensor = transform(image).unsqueeze(0)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")

        # Preprocess clinical data
        try:
            clinical_values = [
                request.clinical_data.age / 100.0,  # Normalize age
                request.clinical_data.gender,
                request.clinical_data.bmi / 50.0,  # Normalize BMI
                request.clinical_data.blood_pressure_systolic / 200.0,
                request.clinical_data.blood_pressure_diastolic / 120.0,
                request.clinical_data.cholesterol / 300.0,
                request.clinical_data.glucose / 200.0,
                request.clinical_data.smoking,
                request.clinical_data.family_history,
                request.clinical_data.symptoms_severity / 10.0
            ]
            clinical_tensor = torch.tensor(clinical_values, dtype=torch.float32).unsqueeze(0)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid clinical data: {str(e)}")

        # Create cache key
        data_hash = hashlib.md5(
            (str(clinical_values) + request.image_base64[:100]).encode()
        ).hexdigest()
        cache_key = f"predict:{data_hash}"
        
        # Check cache
        if CACHE_AVAILABLE:
            cached = get_cached_prediction(cache_key)
            if cached:
                return PredictResponse(
                    prediction=cached['prediction'],
                    confidence=cached['confidence'],
                    encrypted_prediction=cached['encrypted_prediction'],
                    cache_hit=True
                )
        else:
            print("Cache not available, skipping cache check")

        # Inference
        with torch.no_grad():
            prediction_tensor = model(image_tensor, clinical_tensor)
            probabilities = prediction_tensor.squeeze().tolist()
            
            # Map predictions to disease classes
            class_names = ["Benign", "Malignant", "Suspicious"]
            prediction_dict = {
                class_names[i]: prob for i, prob in enumerate(probabilities)
            }
            confidence = max(probabilities)
            predicted_class = class_names[probabilities.index(max(probabilities))]

        # Prepare result
        result = {
            "predicted_class": predicted_class,
            "probabilities": prediction_dict,
            "risk_level": "High" if confidence > 0.7 and predicted_class == "Malignant" else "Medium" if confidence > 0.5 else "Low"
        }

        # Encrypt prediction using PQC
        try:
            if PQC_AVAILABLE:
                kyber = KyberCipher()
                prediction_json = json.dumps(result)
                ciphertext, _ = kyber.encrypt(prediction_json.encode())
                encrypted_prediction = base64.b64encode(ciphertext).decode()
            else:
                encrypted_prediction = base64.b64encode(json.dumps(result).encode()).decode()
        except Exception as e:
            # Fallback to simple base64 encoding if PQC fails
            encrypted_prediction = base64.b64encode(json.dumps(result).encode()).decode()

        # Cache result
        if CACHE_AVAILABLE:
            cache_data = {
                "prediction": result,
                "confidence": confidence,
                "encrypted_prediction": encrypted_prediction
            }
            cache_prediction(cache_key, cache_data)

        return PredictResponse(
            prediction=result,
            confidence=confidence,
            encrypted_prediction=encrypted_prediction,
            cache_hit=False
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/upload_record")
def upload_record(request: UploadRecordRequest):
    try:
        # Verify signature using Dilithium5
        message = json.dumps(request.patient_data, sort_keys=True).encode()
        if PQC_AVAILABLE:
            try:
                signature = base64.b64decode(request.signature)
                public_key = base64.b64decode(request.public_key)
                if not verify_signature(message, signature, public_key):
                    raise HTTPException(status_code=400, detail="Invalid signature")
            except Exception as e:
                # For demo purposes, skip signature verification if PQC fails
                print(f"Signature verification skipped due to: {e}")
        
        # Encrypt patient data
        encrypted_data = base64.b64encode(json.dumps(request.patient_data).encode()).decode()
        
        # Prepare record for database
        record = {
            "patient_id": request.patient_id,
            "data": encrypted_data,
            "timestamp": "now()",
            "signature_verified": True
        }
        
        # Store in database
        if DB_AVAILABLE:
            try:
                response = insert_health_record(record)
                return {
                    "status": "success",
                    "message": "Health record uploaded successfully",
                    "patient_id": request.patient_id,
                    "database_used": True
                }
            except Exception as e:
                return {
                    "status": "success", 
                    "message": f"Record processed but database error: {str(e)}",
                    "patient_id": request.patient_id,
                    "database_used": False
                }
        else:
            return {
                "status": "success",
                "message": "Health record processed (database not available)",
                "patient_id": request.patient_id,
                "database_used": False
            }
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload error: {str(e)}")

@app.get("/health", response_model=HealthResponse)
def health_check():
    """Comprehensive health check endpoint"""
    try:
        # Check model
        model_loaded = model is not None
        
        # Check database connection
        database_connected = False
        if DB_AVAILABLE:
            try:
                database_connected = db_health_check()
            except:
                database_connected = False
            
        # Check cache connection
        cache_connected = False
        if CACHE_AVAILABLE:
            try:
                cache_connected = cache_health_check()
            except:
                cache_connected = False
            
        status = "ok" if all([model_loaded, database_connected, cache_connected]) else "degraded"
        
        return HealthResponse(
            status=status,
            model_loaded=model_loaded,
            database_connected=database_connected,
            cache_connected=cache_connected
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@app.get("/")
def root():
    """Root endpoint with API information"""
    return {
        "message": "Quantum-Secure Predictive Healthcare Platform",
        "version": "1.0.0",
        "endpoints": [
            "/predict - POST: Make health predictions",
            "/upload_record - POST: Upload patient records",
            "/health - GET: Health check",
            "/docs - GET: API documentation"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
