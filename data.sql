CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    full_name VARCHAR(200),
    email VARCHAR(200),
	password VARCHAR(256),
    reset_token_hash VARCHAR(64) NULL DEFAULT NULL UNIQUE,
    reset_token_expires_at DATETIME NULL DEFAULT NULL,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    full_name VARCHAR(200),
    date_of_birth VARCHAR(50),
    contact VARCHAR(50),
    address VARCHAR(256),
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
    needs_onboarding BOOLEAN DEFAULT TRUE,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medications (
    medication_id VARCHAR(50) PRIMARY KEY,
    patient_id INT,
    medication_name VARCHAR(200),
    type VARCHAR(50),
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    start_date VARCHAR(50),
    end_date VARCHAR(50),
    reminder VARCHAR(200),
    dates JSON,
    actions JSON,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

CREATE TABLE bp_readings (
    reading_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    date_taken VARCHAR(200),
    time_taken VARCHAR(200),
    systolic DECIMAL(5, 2),
    diastolic DECIMAL(5, 2),
    pulse_rate DECIMAL(5, 2),
    comments TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);

CREATE TABLE admin (
	admin_id INT AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(200),
	password VARCHAR(256),
	reset_token_hash VARCHAR(64) NULL DEFAULT NULL UNIQUE,
	reset_token_expires_at DATETIME NULL DEFAULT NULL,
	date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)