CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50),
	password VARCHAR(256),
    reset_token_hash VARCHAR(64) NULL DEFAULT NULL UNIQUE,
    reset_token_expires_at DATETIME NULL DEFAULT NULL,
    age VARCHAR(50),
    gender VARCHAR(50),
    bmi_height_cm VARCHAR(50),
    bmi_weight_kg VARCHAR(50),
    vices JSON,
    comorbidities JSON,
    parental_hypertension VARCHAR(50),
    lifestyle VARCHAR(50),
    needsOnboarding BOOLEAN DEFAULT TRUE,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);