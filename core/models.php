<?php  

require_once 'dbConfig.php';

function registerPatient($pdo, $first_name, $last_name, $full_name, $date_of_birth, $email, $password, $age, $gender, $bmi_height_cm, $bmi_weight_kg, $vices, $comorbidities, $parental_hypertension, $lifestyle) {
    $checkUserSql = "SELECT * FROM patients WHERE email = ?";
    $checkUserSqlStmt = $pdo->prepare($checkUserSql);
    $checkUserSqlStmt->execute([$email]);

    if ($checkUserSqlStmt->rowCount() == 0) {
        $sql = "INSERT INTO patients (first_name,last_name,full_name,date_of_birth,email,password,age,gender,bmi_height_cm,bmi_weight_kg,vices,comorbidities,parental_hypertension,lifestyle) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        $stmt = $pdo->prepare($sql);

        // Encode JSON fields since they can contain arrays
        $vices_json = json_encode($vices);
        $comorbidities_json = json_encode($comorbidities);
        
        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        $executeQuery = $stmt->execute([$first_name, $last_name, $full_name, $date_of_birth, $email, $password_hash, $age, $gender, $bmi_height_cm, $bmi_weight_kg, $vices_json, $comorbidities_json, $parental_hypertension, $lifestyle]);

        if ($executeQuery) {
            return [
                "success" => true, 
                "message" => "User successfully registered!" 
            ];
        } else {
            return [
                "success" => false, 
                "message" => "An error occurred from the query" 
            ];
        }
    } else {
        return [
            "success" => false, 
            "message" => "User already exists" 
        ];
    }
}

function patientLogin($pdo, $email, $password) {
    $sql = "SELECT * FROM patients WHERE email = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]); 

    if ($stmt->rowCount() == 1) {
        $patientInfoRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $patientIDFromDB = $patientInfoRow['patient_id']; 
        $emailFromDB = $patientInfoRow['email']; 
        $passwordFromDB = $patientInfoRow['password'];

        if (password_verify($password, $passwordFromDB)) {
            return [
                "id"      =>  $patientIDFromDB,
                "firstName" => $patientInfoRow['first_name'],
                "message" => "Login successful!",
                "needsOnboarding" => $patientInfoRow['needs_onboarding'],
                "userRole"    => "patient",
                "success" => true, 
            ];
        } else {
            return [
                "success" => false, 
                "message" => "Email/Password is incorrect."
            ];
        }
    } else {
        return [
            "success" => false, 
            "message" => "Email/Password is incorrect."
        ];
    }
}

function doctorLogin($pdo, $email, $password) {
    $sql = "SELECT * FROM doctors WHERE email = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email]); 

    if ($stmt->rowCount() == 1) {
        $doctorInfoRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $doctorIDFromDB = $doctorInfoRow['doctor_id']; 
        $emailFromDB = $doctorInfoRow['email']; 
        $passwordFromDB = $doctorInfoRow['password'];

        if (password_verify($password, $passwordFromDB)) {
            return [
                "id"      =>  $doctorIDFromDB,
                "firstName" => $doctorInfoRow['first_name'],
                "message" => "Login successful!",
                "userRole"    => "doctor",
                "success" => true, 
            ];
        } else {
            return [
                "success" => false, 
                "message" => "Email/Password is incorrect."
            ];
        }
    } else {
        return [
            "success" => false, 
            "message" => "Email/Password is incorrect."
        ];
    }
}

function updatePatientNeedsOnboarding($pdo, $patient_id, $needs_onboarding) {
    $sql = "UPDATE patients SET needs_onboarding = ? WHERE patient_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $needs_onboarding,
        $patient_id
    ]);
}

function forgotPassword($pdo, $email) {
    date_default_timezone_set('Asia/Manila'); 
    
    $token = bin2hex(random_bytes(16));
    $token_hash = hash("sha256", $token);
    $expiry = date("Y-m-d H:i:s", time() + 60 * 30);

    $sql = "UPDATE patients
            SET reset_token_hash = ?, reset_token_expires_at = ?
            WHERE email = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$token_hash, $expiry, $email]);

    if ($stmt->rowCount() > 0) {
        $mail = require __DIR__ . "/mailer.php";

        try {
            $mail->addAddress($email);
            $mail->Subject = 'Password Reset';
            $mail->Body = <<<END
Click <a href="http://tan-boar-707148.hostingersite.com/core/reset-password.php?token=$token">here</a> to reset your password.
END;
            $mail->AltBody = 'reset password';
            $mail->send();
        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Message could not be sent. Mailer error: {$mail->ErrorInfo}"
            ];
        }
    }
    return [
        "success" => true,
        "message" => "Password reset email sent. Expires in 30 minutes. Email may arrived in spam and a few minutes late."
    ];
}

function addNewMedication($pdo, $medication_id, $patient_id, $medication_name, $type, $dosage, $frequency, $start_date, $end_date, $reminder, $dates, $actions) {
    $sql = "INSERT INTO medications (medication_id, patient_id, medication_name, type, dosage, frequency, start_date, end_date, reminder, dates, actions) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    $stmt = $pdo->prepare($sql);

    $dates_json = json_encode($dates);
    $actions_json = json_encode($actions);

    $executeQuery = $stmt->execute([$medication_id, $patient_id, $medication_name, $type, $dosage, $frequency, $start_date, $end_date, $reminder, $dates_json, $actions_json]);

    if ($executeQuery) {
        return [
            "success" => true,
            "message" => "New medication set!"
        ];
    } else {
        return [
            "success" => false,
            "message" => "An error occurred from the query"
        ];
    }
}

function getMedicationList($pdo, $patient_id, $selected_date) {
    $sql = "SELECT * FROM medications WHERE patient_id = ? AND JSON_CONTAINS(dates, ?)";
    $stmt = $pdo->prepare($sql);
    
    $jsonSelectedDate = json_encode($selected_date);
    
    $stmt->execute([$patient_id, $jsonSelectedDate]);

    if ($stmt->rowCount() > 0) {
        $medications = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $medications = array_map(function($medication) {
            return [
                "medicationId" => $medication["medication_id"],
                "patientId" => $medication["patient_id"],
                "medicationName" => $medication["medication_name"],
                "type" => $medication["type"],
                "dosage" => $medication["dosage"],
                "frequency" => $medication["frequency"],
                "startDate" => $medication["start_date"],
                "endDate" => $medication["end_date"],
                "reminder" => $medication["reminder"],
                "dates"   => json_decode($medication["dates"]),
                "actions" => json_decode($medication["actions"])
            ];
        }, $medications);

        return [
            "success" => true,
            "medications" => $medications
        ];
    } else {
        return [
            "success" => false,
            "message" => "No medications found."
        ];
    }
}

function addNewMedicationStatus($pdo, $medication_id, $date, $status, $time) {
    $sql = "SELECT actions FROM medications WHERE medication_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$medication_id]);

    if ($stmt->rowCount() > 0) {
        $medication = $stmt->fetch(PDO::FETCH_ASSOC);
        $actions = json_decode($medication['actions'], true);

        // Append the new status object to the actions array
        $newAction = [
            'date' => $date,
            'status' => $status,
            'time' => $time,
        ];
        $actions[] = $newAction;

        // Update the actions column with the modified array
        $actions_json = json_encode($actions);
        $updateSql = "UPDATE medications SET actions = ? WHERE medication_id = ?";
        $updateStmt = $pdo->prepare($updateSql);
        $executeQuery = $updateStmt->execute([$actions_json, $medication_id]);

        if ($executeQuery) {
            return [
                "success" => true,
                "message" => "New medication status added!"
            ];
        } else {
            return [
                "success" => false,
                "message" => "An error occurred while updating the medication status"
            ];
        }
    } else {
        return [
            "success" => false,
            "message" => "Medication not found"
        ];
    }
}

function addNewBpForToday ($pdo, $patient_id, $systolic, $diastolic, $date_taken) {
    $sql = "INSERT INTO bp_readings (patient_id, systolic, diastolic, date_taken) VALUES (?,?,?,?)";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$patient_id, $systolic, $diastolic, $date_taken]);

    if ($executeQuery) {
        return [
            "success" => true,
            "message" => "New blood pressure record added!"
        ];
    } else {
        return [
            "success" => false,
            "message" => "An error occurred while adding the blood pressure record"
        ];
    }
}

function checkIfUserHasAlreadyBpToday($pdo, $patient_id, $date_taken) {
    $sql = "SELECT * FROM bp_readings WHERE patient_id = ? AND date_taken = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$patient_id, $date_taken]);

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            "success" => true,
            "message" => "User already has a blood pressure record for today",
            "systolic" => $row['systolic'],
            "diastolic" => $row['diastolic']
        ];
    } else {
        return [
            "success" => false,
            "message" => "User does not have a blood pressure record for today"
        ];
    }
}

function getPatientProfile($pdo, $patient_id) {
    $sql = "SELECT * FROM patients WHERE patient_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$patient_id]);

    if ($stmt->rowCount() > 0) {
        $patient = $stmt->fetch(PDO::FETCH_ASSOC);

        $patient = [
            "firstName" => $patient["first_name"],
            "lastName" => $patient["last_name"],
            "dateOfBirth" => $patient["date_of_birth"],
            "email" => $patient["email"],
            "age" => $patient["age"],
            "gender" => $patient["gender"],
            "bmiHeightCm" => $patient["bmi_height_cm"],
            "bmiWeightKg" => $patient["bmi_weight_kg"],
            "vices" => json_decode($patient["vices"], true),
            "comorbidities" => json_decode($patient["comorbidities"], true),
            "parentalHypertension" => $patient["parental_hypertension"],
            "lifestyle" => $patient["lifestyle"]
        ];

        return [
            "success" => true,
            "patient" => $patient
        ];
    } else {
        return [
            "success" => false,
            "message" => "Patient not found"
        ];
    }
}

function getDoctorProfile($pdo, $doctor_id) {
    $sql = "SELECT * FROM doctors WHERE doctor_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$doctor_id]);

    if ($stmt->rowCount() > 0) {
        $doctor = $stmt->fetch(PDO::FETCH_ASSOC);

        $doctor = [
            "firstName" => $doctor["first_name"],
            "lastName" => $doctor["last_name"],
            "email" => $doctor["email"]
        ];

        return [
            "success" => true,
            "doctor" => $doctor
        ];
    } else {
        return [
            "success" => false,
            "message" => "Doctor not found"
        ];
    }
}

function updatePatientProfile($pdo, $patient_id, $first_name, $last_name, $full_name, $date_of_birth, $email, $age, $gender, $bmi_height_cm, $bmi_weight_kg, $vices, $comorbidities, $parental_hypertension, $lifestyle) {
    // Encode JSON fields since they can contain arrays
    $vices_json = json_encode($vices);
    $comorbidities_json = json_encode($comorbidities);

    $sql = "UPDATE patients SET first_name=?, last_name=?, full_name=?, date_of_birth=?, email=?, age=?, gender=?, bmi_height_cm=?, bmi_weight_kg=?, vices=?, comorbidities=?, parental_hypertension=?, lifestyle=? WHERE patient_id=?";

    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$first_name, $last_name, $full_name, $date_of_birth, $email, $age, $gender, $bmi_height_cm, $bmi_weight_kg, $vices_json, $comorbidities_json, $parental_hypertension, $lifestyle, $patient_id]);
    if ($executeQuery) {
        return [
            "success" => true,
            "message" => "Profile updated successfully"
        ];
    } else {
        return [
            "success" => false,
            "message" => "An error occurred while updating the profile"
        ];
    }
}

function updateDoctorProfile($pdo, $doctor_id, $first_name, $last_name, $full_name, $email) {
    $sql = "UPDATE doctors SET first_name=?, last_name=?, full_name=?, email=? WHERE doctor_id=?";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$first_name, $last_name, $full_name, $email, $doctor_id]);

    if ($executeQuery) {
        return [
            "success" => true,
            "message" => "Profile updated successfully"
        ];
    } else {
        return [
            "success" => false,
            "message" => "An error occurred while updating the profile"
        ];
    }
}

function updatePatientPassword($pdo, $patient_id, $old_password, $new_password) {
    $sql = "SELECT * FROM patients WHERE patient_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$patient_id]);

    if ($stmt->rowCount() == 1) {
        $patientInfoRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $passwordFromDB = $patientInfoRow['password'];

        if (password_verify($old_password, $passwordFromDB)) {
            $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);

            $updateSql = "UPDATE patients SET password = ? WHERE patient_id = ?";
            $updateStmt = $pdo->prepare($updateSql);
            $executeQuery = $updateStmt->execute([$new_password_hash, $patient_id]);

            if ($executeQuery) {
                return [
                    "success" => true,
                    "message" => "Password updated successfully"
                ];
            } else {
                return [
                    "success" => false,
                    "message" => "An error occurred while updating the password"
                ];
            }
        } else {
            return [
                "success" => false,
                "message" => "Old password is incorrect"
            ];
        }
    } else {
        return [
            "success" => false,
            "message" => "Patient not found"
        ];
    }
}

function updateDoctorPassword($pdo, $doctor_id, $old_password, $new_password) {
    $sql = "SELECT * FROM doctors WHERE doctor_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$doctor_id]);

    if ($stmt->rowCount() == 1) {
        $doctorInfoRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $passwordFromDB = $doctorInfoRow['password'];

        if (password_verify($old_password, $passwordFromDB)) {
            $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);

            $updateSql = "UPDATE doctors SET password = ? WHERE doctor_id = ?";
            $updateStmt = $pdo->prepare($updateSql);
            $executeQuery = $updateStmt->execute([$new_password_hash, $doctor_id]);

            if ($executeQuery) {
                return [
                    "success" => true,
                    "message" => "Password updated successfully"
                ];
            } else {
                return [
                    "success" => false,
                    "message" => "An error occurred while updating the password"
                ];
            }
        } else {
            return [
                "success" => false,
                "message" => "Old password is incorrect"
            ];
        }
    } else {
        return [
            "success" => false,
            "message" => "Doctor not found"
        ];
    }
}