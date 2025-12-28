// MongoDB initialization script
db = db.getSiblingDB('quantumhealth_db');

// Create collections
db.createCollection('patients');
db.createCollection('predictions');
db.createCollection('health_records');
db.createCollection('sessions');

// Create indexes for better performance
db.patients.createIndex({ "patient_id": 1 }, { unique: true });
db.patients.createIndex({ "email": 1 }, { unique: true });
db.patients.createIndex({ "created_at": 1 });

db.predictions.createIndex({ "patient_id": 1 });
db.predictions.createIndex({ "prediction_id": 1 }, { unique: true });
db.predictions.createIndex({ "created_at": 1 });
db.predictions.createIndex({ "model_version": 1 });

db.health_records.createIndex({ "patient_id": 1 });
db.health_records.createIndex({ "record_id": 1 }, { unique: true });
db.health_records.createIndex({ "created_at": 1 });
db.health_records.createIndex({ "record_type": 1 });

db.sessions.createIndex({ "session_id": 1 }, { unique: true });
db.sessions.createIndex({ "user_id": 1 });
db.sessions.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0 });

// Insert sample data
db.patients.insertOne({
    patient_id: "demo_patient_001",
    email: "demo@quantumhealth.com", 
    name: "Demo Patient",
    age: 35,
    gender: "female",
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true
});

print('QuantumHealth database initialized successfully!');