# Quantum-Secure Dermatology AI Platform 🔬🔐

A cutting-edge healthcare prediction platform that combines **multimodal AI**, **post-quantum cryptography**, and **distributed caching** for secure and accurate skin cancer detection.

## 🌟 Features

- **🤖 Multimodal HQCNN Model**: Hybrid quantum-classical neural network combining image analysis and clinical data
- **🔒 Post-Quantum Cryptography**: Kyber encryption for quantum-resistant data security
- **⚡ Real-time Predictions**: Fast inference with Redis caching for improved performance
- **📊 Comprehensive Dashboard**: Modern Next.js frontend with analytics and patient management
- **🗄️ MongoDB Storage**: Secure storage of health records and predictions
- **🐳 Docker Deployment**: Fully containerized with Docker Compose for easy setup
- **📈 Monitoring**: Prometheus and Grafana integration for performance tracking

## 🏗️ Architecture

```
┌─────────────────┐
│  Next.js Web UI │ (Port 3000)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FastAPI Backend│ (Port 8001)
└────────┬────────┘
         │
    ┌────┴─────────────────┐
    ▼                      ▼
┌─────────┐          ┌──────────┐
│ MongoDB │          │  Redis   │
│(27017)  │          │  (6379)  │
└─────────┘          └──────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Docker & Docker Compose (optional, for containerized deployment)
- MongoDB (if running locally)
- Redis (if running locally)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
```bash
git clone <repository-url>
cd quantum-dermo-ai
```

2. **Start all services**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs
- MongoDB Express: http://localhost:8082

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Start MongoDB and Redis** (using Docker)
```bash
cd ..
docker-compose up -d mongodb redis
```

5. **Run the backend**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

#### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/docs

## 📁 Project Structure

```
quantum-dermo-ai/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI application
│   │   ├── cache.py             # Redis caching layer
│   │   ├── database.py          # MongoDB operations
│   │   ├── monitoring.py        # Prometheus metrics
│   │   ├── pqc_bc.py           # Blockchain integration
│   │   └── pqc_utils.py        # Post-quantum crypto utils
│   ├── model/
│   │   └── best_multimodal_hqcnn.pth  # Trained model
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Home page
│   │   ├── predict/            # Prediction interface
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── analytics/          # Analytics page
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── forms/              # Form components
│   │   ├── display/            # Display components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # UI primitives
│   ├── lib/
│   │   └── api/                # API client
│   ├── Dockerfile
│   └── package.json
├── ml_src/
│   ├── best_multimodal_hqcnn.pth
│   └── *.ipynb                 # Training notebooks
├── monitoring/
│   ├── prometheus/
│   │   └── prometheus.yml
│   └── grafana/
│       └── provisioning/
├── docker-compose.yml
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (`backend/.env`)
```env
# MongoDB Configuration
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=healthcare_db
MONGO_USERNAME=admin
MONGO_PASSWORD=healthcare_admin_pass

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=healthcare_redis_pass

# Cache TTL (seconds)
CACHE_DEFAULT_TTL=3600
CACHE_PREDICTION_TTL=1800
CACHE_HEALTH_RECORD_TTL=7200

# Application
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development
```

#### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Docker Compose Ports

| Service | Internal Port | External Port |
|---------|--------------|---------------|
| Backend | 8000 | 8001 |
| Frontend | 3000 | 3000 |
| MongoDB | 27017 | 27018 |
| Redis | 6379 | 6380 |
| MongoDB Express | 8081 | 8082 |
| Prometheus | 9090 | 9091 |
| Grafana | 3000 | 3001 |

## 🧪 API Endpoints

### Health Check
```bash
GET /health
```

### Make Prediction
```bash
POST /predict
Content-Type: application/json

{
  "clinical_data": {
    "age": 45,
    "gender": 1,
    "bmi": 24.5,
    "blood_pressure_systolic": 120,
    "blood_pressure_diastolic": 80,
    "cholesterol": 180,
    "glucose": 95,
    "smoking": 0,
    "family_history": 1,
    "symptoms_severity": 3.5
  },
  "image_base64": "<base64-encoded-image>"
}
```

### Store Health Record
```bash
POST /upload_record
Content-Type: application/json

{
  "patient_id": "P12345",
  "patient_data": {...},
  "signature": "<digital-signature>"
}
```

## 🧠 Model Architecture

The **Multimodal HQCNN** (Hybrid Quantum-Classical Neural Network) combines:

1. **Image Processing Branch**
   - ResNet-50 backbone for feature extraction
   - Custom FC layers for dimensionality reduction
   - Dropout layers for regularization

2. **Clinical Data Branch**
   - Dense neural network for structured data
   - Processes 10 clinical features

3. **Fusion Layer**
   - Combines image and clinical features
   - Multi-layer perceptron for final classification

4. **Output**
   - 3-class classification (Benign, Malignant, Unknown)
   - Softmax activation for probability distribution

## 🔐 Security Features

- **Post-Quantum Cryptography**: Kyber key encapsulation for quantum-resistant encryption
- **Digital Signatures**: Cryptographic verification of data integrity
- **CORS Protection**: Configurable cross-origin policies
- **Secure Storage**: Encrypted data at rest in MongoDB
- **Authentication**: JWT-based access control (extensible)

## 📊 Monitoring & Observability

- **Prometheus Metrics**: Request counts, latency, error rates
- **Grafana Dashboards**: Real-time visualization of system health
- **Health Checks**: Liveness and readiness probes for all services
- **Logging**: Structured logging with JSON format

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests (if configured)
cd frontend
npm test
```

## 🚢 Production Deployment

1. **Update environment variables** in `docker-compose.yml`
2. **Change default passwords** for MongoDB, Redis
3. **Configure SSL/TLS** certificates for HTTPS
4. **Set up reverse proxy** (Nginx/Traefik) for load balancing
5. **Enable monitoring** with Prometheus & Grafana
6. **Configure backup strategy** for MongoDB data
7. **Deploy with Docker Compose**:
```bash
docker-compose -f docker-compose.yml up -d
```

## 📝 Development

### Adding New Features

1. **Backend**: Add endpoints in `backend/app/main.py`
2. **Frontend**: Create pages in `frontend/app/`
3. **API Client**: Update `frontend/lib/api/services.ts`
4. **Database**: Add collections in `backend/app/database.py`
5. **Cache**: Configure in `backend/app/cache.py`

### Code Formatting

```bash
# Backend
black backend/app/
flake8 backend/app/

# Frontend
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **PyTorch** for deep learning framework
- **FastAPI** for high-performance API backend
- **Next.js** for modern React framework
- **MongoDB** for flexible document storage
- **Redis** for high-speed caching
- **liboqs** for post-quantum cryptography implementations

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

## ⚠️ Disclaimer

This is a research and educational project. The AI model predictions should not be used as a substitute for professional medical diagnosis. Always consult with qualified healthcare professionals for medical advice.

---

**Built with ❤️ for advancing secure healthcare AI**
