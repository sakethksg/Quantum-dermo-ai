# database.py
import os
import json
from datetime import datetime
import logging
from typing import Dict, List, Optional, Any
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import certifi

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB configuration from environment variables
MONGO_HOST = os.getenv("MONGO_HOST", "localhost")
MONGO_PORT = int(os.getenv("MONGO_PORT", "27017"))
MONGO_DB = os.getenv("MONGO_DB", "healthcare_db")
MONGO_USERNAME = os.getenv("MONGO_USERNAME", "admin")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "healthcare_admin_pass")
MONGO_AUTH_DB = os.getenv("MONGO_AUTH_DB", "admin")

# Collections
HEALTH_RECORDS_COLLECTION = "health_records"
PREDICTIONS_COLLECTION = "predictions"
PATIENTS_COLLECTION = "patients"

class DatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None
        self.connect()
    
    def connect(self):
        """Establish connection to MongoDB"""
        try:
            # Build connection string
            if MONGO_USERNAME and MONGO_PASSWORD:
                connection_string = f"mongodb://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}/{MONGO_AUTH_DB}"
            else:
                connection_string = f"mongodb://{MONGO_HOST}:{MONGO_PORT}/"
            
            # Create MongoDB client with SSL options
            self.client = MongoClient(
                connection_string,
                serverSelectionTimeoutMS=5000,  # 5 second timeout
                connectTimeoutMS=10000,
                socketTimeoutMS=10000,
                tlsCAFile=certifi.where() if os.getenv("MONGO_TLS", "false").lower() == "true" else None
            )
            
            # Test connection
            self.client.admin.command('ping')
            
            # Get database
            self.db = self.client[MONGO_DB]
            
            # Create indexes for better performance
            self._create_indexes()
            
            logger.info(f"Successfully connected to MongoDB: {MONGO_HOST}:{MONGO_PORT}")
            
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            self.client = None
            self.db = None
    
    def _create_indexes(self):
        """Create necessary indexes for collections"""
        try:
            if self.db is not None:
                # Index for health records
                self.db[HEALTH_RECORDS_COLLECTION].create_index("patient_id")
                self.db[HEALTH_RECORDS_COLLECTION].create_index("timestamp")
                
                # Index for predictions
                self.db[PREDICTIONS_COLLECTION].create_index("patient_id")
                self.db[PREDICTIONS_COLLECTION].create_index("timestamp")
                self.db[PREDICTIONS_COLLECTION].create_index("prediction_id")
                
                # Index for patients
                self.db[PATIENTS_COLLECTION].create_index("patient_id", unique=True)
                
                logger.info("Database indexes created successfully")
        except Exception as e:
            logger.warning(f"Failed to create indexes: {e}")
    
    def is_connected(self) -> bool:
        """Check if database connection is active"""
        try:
            if self.client is None:
                return False
            self.client.admin.command('ping')
            return True
        except Exception:
            return False
    
    def close_connection(self):
        """Close database connection"""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed")

# Global database manager instance
db_manager = DatabaseManager()

def get_database():
    """Get database instance"""
    if not db_manager.is_connected():
        db_manager.connect()
    return db_manager.db

def health_check() -> bool:
    """Database health check"""
    return db_manager.is_connected()

def insert_health_record(record: Dict[str, Any]) -> Dict[str, Any]:
    """Insert a health record into the database"""
    try:
        db = get_database()
        if db is None:
            raise Exception("Database not connected")
        
        # Add timestamp if not present
        if "timestamp" not in record:
            record["timestamp"] = datetime.utcnow()
        
        # Ensure required fields
        if "patient_id" not in record:
            raise ValueError("patient_id is required")
        
        # Insert record
        result = db[HEALTH_RECORDS_COLLECTION].insert_one(record)
        
        logger.info(f"Health record inserted for patient {record['patient_id']}")
        
        return {
            "success": True,
            "record_id": str(result.inserted_id),
            "patient_id": record["patient_id"]
        }
        
    except Exception as e:
        logger.error(f"Failed to insert health record: {e}")
        raise Exception(f"Database insert failed: {str(e)}")

def get_health_records(patient_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Retrieve health records for a patient"""
    try:
        db = get_database()
        if db is None:
            raise Exception("Database not connected")
        
        # Query records
        records = list(
            db[HEALTH_RECORDS_COLLECTION]
            .find({"patient_id": patient_id})
            .sort("timestamp", -1)
            .limit(limit)
        )
        
        # Convert ObjectId to string for JSON serialization
        for record in records:
            record["_id"] = str(record["_id"])
        
        return records
        
    except Exception as e:
        logger.error(f"Failed to retrieve health records: {e}")
        raise Exception(f"Database query failed: {str(e)}")

def insert_prediction(prediction_data: Dict[str, Any]) -> Dict[str, Any]:
    """Insert a prediction result into the database"""
    try:
        db = get_database()
        if db is None:
            raise Exception("Database not connected")
        
        # Add metadata
        prediction_data["timestamp"] = datetime.utcnow()
        prediction_data["prediction_id"] = f"pred_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
        
        # Insert prediction
        result = db[PREDICTIONS_COLLECTION].insert_one(prediction_data)
        
        logger.info(f"Prediction stored with ID: {prediction_data['prediction_id']}")
        
        return {
            "success": True,
            "prediction_id": prediction_data["prediction_id"],
            "record_id": str(result.inserted_id)
        }
        
    except Exception as e:
        logger.error(f"Failed to insert prediction: {e}")
        raise Exception(f"Database insert failed: {str(e)}")

def get_predictions(patient_id: str = None, limit: int = 10) -> List[Dict[str, Any]]:
    """Retrieve predictions, optionally filtered by patient_id"""
    try:
        db = get_database()
        if db is None:
            raise Exception("Database not connected")
        
        # Build query
        query = {}
        if patient_id:
            query["patient_id"] = patient_id
        
        # Query predictions
        predictions = list(
            db[PREDICTIONS_COLLECTION]
            .find(query)
            .sort("timestamp", -1)
            .limit(limit)
        )
        
        # Convert ObjectId to string for JSON serialization
        for prediction in predictions:
            prediction["_id"] = str(prediction["_id"])
        
        return predictions
        
    except Exception as e:
        logger.error(f"Failed to retrieve predictions: {e}")
        raise Exception(f"Database query failed: {str(e)}")

def upsert_patient(patient_data: Dict[str, Any]) -> Dict[str, Any]:
    """Insert or update patient information"""
    try:
        db = get_database()
        if db is None:
            raise Exception("Database not connected")
        
        # Ensure required fields
        if "patient_id" not in patient_data:
            raise ValueError("patient_id is required")
        
        # Add/update timestamp
        patient_data["last_updated"] = datetime.utcnow()
        
        # Upsert patient
        result = db[PATIENTS_COLLECTION].update_one(
            {"patient_id": patient_data["patient_id"]},
            {"$set": patient_data},
            upsert=True
        )
        
        operation = "updated" if result.matched_count > 0 else "inserted"
        logger.info(f"Patient {patient_data['patient_id']} {operation}")
        
        return {
            "success": True,
            "patient_id": patient_data["patient_id"],
            "operation": operation
        }
        
    except Exception as e:
        logger.error(f"Failed to upsert patient: {e}")
        raise Exception(f"Database upsert failed: {str(e)}")

def get_patient(patient_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve patient information"""
    try:
        db = get_database()
        if db is None:
            raise Exception("Database not connected")
        
        # Query patient
        patient = db[PATIENTS_COLLECTION].find_one({"patient_id": patient_id})
        
        if patient:
            patient["_id"] = str(patient["_id"])
        
        return patient
        
    except Exception as e:
        logger.error(f"Failed to retrieve patient: {e}")
        raise Exception(f"Database query failed: {str(e)}")

def get_database_stats() -> Dict[str, Any]:
    """Get database statistics"""
    try:
        db = get_database()
        if db is None:
            return {"error": "Database not connected"}
        
        stats = {
            "connected": True,
            "database_name": db.name,
            "collections": {
                "health_records": db[HEALTH_RECORDS_COLLECTION].count_documents({}),
                "predictions": db[PREDICTIONS_COLLECTION].count_documents({}),
                "patients": db[PATIENTS_COLLECTION].count_documents({})
            }
        }
        
        return stats
        
    except Exception as e:
        logger.error(f"Failed to get database stats: {e}")
        return {"error": str(e), "connected": False}

# Cleanup function
def cleanup_database():
    """Close database connections"""
    db_manager.close_connection()