<?php  

require_once 'encryption.php'; 
require_once 'dbConfig.php';

function registerPatient($pdo, $first_name, $last_name, $full_name, $date_of_birth, $contact, $address, $email, $password, $age, $gender, $bmi_height_cm, $bmi_weight_kg, $vices = [], $comorbidities = [], $parental_hypertension, $lifestyle) {
    global $encryption_key;

    $email_hash = hash('sha256', $email);
    
    $checkUserSql = "SELECT * FROM patients WHERE email_hash = ?";
    $checkUserSqlStmt = $pdo->prepare($checkUserSql);
    $checkUserSqlStmt->execute([$email_hash]);

    if ($checkUserSqlStmt->rowCount() == 0) {
        $sql = "INSERT INTO patients (first_name,last_name,full_name,date_of_birth,contact,address,email,password,age,gender,bmi_height_cm,bmi_weight_kg,vices,comorbidities,parental_hypertension,lifestyle,email_hash) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        $stmt = $pdo->prepare($sql);

        // Encode JSON fields since they can contain arrays
        $vices_json = json_encode($vices);
        $comorbidities_json = json_encode($comorbidities);
        
        $encrypted_first_name = encryptData($first_name, $encryption_key);
        $encrypted_last_name = encryptData($last_name, $encryption_key);
        $encrypted_full_name = encryptData($full_name, $encryption_key);
        $encrypted_email = encryptData($email, $encryption_key);
        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        $executeQuery = $stmt->execute([$encrypted_first_name, $encrypted_last_name, $encrypted_full_name, $date_of_birth, $contact, $address, $encrypted_email, $password_hash, $age, $gender, $bmi_height_cm, $bmi_weight_kg, $vices_json, $comorbidities_json, $parental_hypertension, $lifestyle, $email_hash]);

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
    global $encryption_key;

    $email_hash = hash('sha256', $email);

    $sql = "SELECT * FROM patients WHERE email_hash = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email_hash]); 

    if ($stmt->rowCount() == 1) {
        $patientInfoRow = $stmt->fetch(PDO::FETCH_ASSOC);

        $patientInfoRow['first_name'] = decryptData($patientInfoRow['first_name'], $encryption_key);
        $patientInfoRow['email'] = decryptData($patientInfoRow['email'], $encryption_key);
        $passwordFromDB = $patientInfoRow['password'];

        if (password_verify($password, $passwordFromDB)) {
            return [
                "id"      =>  $patientInfoRow['patient_id'],
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
    global $encryption_key;
    
    $email_hash = hash('sha256', $email);
    
    $sql = "SELECT * FROM doctors WHERE email_hash = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email_hash]); 
    
    if ($stmt->rowCount() == 1) {
        $doctorInfoRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $passwordFromDB = $doctorInfoRow['password']; 

        if (password_verify($password, $passwordFromDB)) {
            return [
                "id"      =>  $doctorInfoRow['doctor_id'],
                "firstName" => decryptData($doctorInfoRow['first_name'], $encryption_key),
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

function updateGenerateReport($pdo, $patient_id) {
    $sql = "UPDATE patients SET did_generate_report = 1 WHERE patient_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $patient_id
    ]);
}

function updateSurveyAnswered($pdo, $patient_id) {
    $sql = "UPDATE patients SET did_answered_survey = 1 WHERE patient_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $patient_id
    ]);
}

function forgotPassword($pdo, $email, $table_name) {
    global $encryption_key;
    
    date_default_timezone_set('Asia/Manila');
    
    $email_hash = hash('sha256', $email);
    
    $token = bin2hex(random_bytes(16));
    $token_hash = hash("sha256", $token);
    $expiry = date("Y-m-d H:i:s", time() + 60 * 30);

    $sql = "UPDATE $table_name
            SET reset_token_hash = ?, reset_token_expires_at = ?
            WHERE email_hash = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$token_hash, $expiry, $email_hash]);

    if ($stmt->rowCount() > 0) {
        $mail = require __DIR__ . "/mailer.php";

        try {
            $mail->addAddress($email);
            $mail->Subject = 'Password Reset';
            $mail->Body = <<<END
Click <a href="http://tan-boar-707148.hostingersite.com/core/reset-password.php?token=$token&table_name=$table_name">here</a> to reset your password.
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

function getMedicationListForSelectedDate($pdo, $patient_id, $selected_date) {
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

function addNewBp($pdo, $patient_id, $date_taken, $time_taken, $systolic, $diastolic, $pulse_rate, $comments) {
    $sql = "INSERT INTO bp_readings (patient_id, date_taken, time_taken, systolic, diastolic, pulse_rate, comments) VALUES (?,?,?,?,?,?,?)";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$patient_id, $date_taken, $time_taken, $systolic, $diastolic, $pulse_rate, $comments]);

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

function getBpForTodayList($pdo, $patient_id, $date_taken) {
    $sql = "SELECT * FROM bp_readings WHERE patient_id = ? AND date_taken = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$patient_id, $date_taken]);

    if ($stmt->rowCount() > 0) {
        $bp_readings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $bp_readings = array_map(function($bp_reading) {
            return [
                "readingId" => $bp_reading["reading_id"],
                "patientId" => $bp_reading["patient_id"],
                "dateTaken" => $bp_reading["date_taken"],
                "timeTaken" => $bp_reading["time_taken"],
                "systolic" => round($bp_reading["systolic"], 1),
                "diastolic" => round($bp_reading["diastolic"], 1),
                "pulseRate" => round($bp_reading["pulse_rate"], 1),
                "comments" => $bp_reading["comments"]
            ];
        },  $bp_readings);

        return [
            "success" => true,
            "bpList" => $bp_readings
        ];
    } else {
        return [
            "success" => false,
            "message" => "No blood pressure data."
        ];
    }
}

function getPatientProfile($pdo, $patient_id) {
    global $encryption_key;
    
    $sql = "SELECT * FROM patients WHERE patient_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$patient_id]);

    if ($stmt->rowCount() > 0) {
        $patient = $stmt->fetch(PDO::FETCH_ASSOC);

        $patient = [
            "firstName" => decryptData($patient["first_name"], $encryption_key),
            "lastName" => decryptData($patient["last_name"], $encryption_key),
            "fullName" => decryptData($patient["full_name"], $encryption_key),
            "dateOfBirth" => $patient["date_of_birth"],
            "contact" => $patient["contact"],
            "address" => $patient["address"],
            "email" => decryptData($patient["email"], $encryption_key),
            "age" => $patient["age"],
            "gender" => $patient["gender"],
            "bmiHeightCm" => $patient["bmi_height_cm"],
            "bmiWeightKg" => $patient["bmi_weight_kg"],
            "vices" => json_decode($patient["vices"], true),
            "comorbidities" => json_decode($patient["comorbidities"], true),
            "parentalHypertension" => $patient["parental_hypertension"],
            "lifestyle" => $patient["lifestyle"],
            "didGenerateReport"=> $patient["did_generate_report"],
            "didAnsweredSurvey"=> $patient["did_answered_survey"]
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
    global $encryption_key;
    
    $sql = "SELECT * FROM doctors WHERE doctor_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$doctor_id]);

    if ($stmt->rowCount() > 0) {
        $doctor = $stmt->fetch(PDO::FETCH_ASSOC);

        $doctor = [
            "firstName" => decryptData($doctor["first_name"], $encryption_key),
            "lastName" => decryptData($doctor["last_name"], $encryption_key),
            "email" => decryptData($doctor["email"], $encryption_key)
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

function updatePatientProfile($pdo, $patient_id, $first_name, $last_name, $full_name, $date_of_birth, $contact, $address, $email, $age, $gender, $bmi_height_cm, $bmi_weight_kg, $vices = [], $comorbidities = [], $parental_hypertension, $lifestyle) {
    global $encryption_key;
    
    $encrypted_first_name = encryptData($first_name, $encryption_key);
    $encrypted_last_name = encryptData($last_name, $encryption_key);
    $encrypted_full_name = encryptData($full_name, $encryption_key);
    $encrypted_email = encryptData($email, $encryption_key);

    $email_hash = hash('sha256', $email);

    // Encode JSON fields since they can contain arrays
    $vices_json = json_encode($vices);
    $comorbidities_json = json_encode($comorbidities);

    $sql = "UPDATE patients SET first_name=?, last_name=?, full_name=?, date_of_birth=?, contact=?, address=?, email=?, age=?, gender=?, bmi_height_cm=?, bmi_weight_kg=?, vices=?, comorbidities=?, parental_hypertension=?, lifestyle=?, email_hash=? WHERE patient_id=?";

    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$encrypted_first_name, $encrypted_last_name, $encrypted_full_name, $date_of_birth, $contact, $address, $encrypted_email, $age, $gender, $bmi_height_cm, $bmi_weight_kg, $vices_json, $comorbidities_json, $parental_hypertension, $lifestyle, $email_hash, $patient_id]);
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
    global $encryption_key;
    
    $encrypted_first_name = encryptData($first_name, $encryption_key);
    $encrypted_last_name = encryptData($last_name, $encryption_key);
    $encrypted_full_name = encryptData($full_name, $encryption_key);
    $encrypted_email = encryptData($email, $encryption_key);

    $email_hash = hash('sha256', $email);
    
    $sql = "UPDATE doctors SET first_name=?, last_name=?, full_name=?, email=?, email_hash=? WHERE doctor_id=?";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$encrypted_first_name, $encrypted_last_name, $encrypted_full_name, $encrypted_email, $email_hash, $doctor_id]);

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

function getAllPatients($pdo) {
    global $encryption_key;
    
    $sql = "SELECT * FROM patients";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $patients = array_map(function($patient) use ($encryption_key) {
            return [
                "patientId" => $patient["patient_id"],
                "fullName" => decryptData($patient["full_name"], $encryption_key),
            ];
        }, $patients);
        return [
            "success" => true,
            "patients" => $patients
        ];
    } else {
        return [
            "success" => false,
            "message" => "No patients found"
        ];
    }
}

function deletePatientAccountAndData($pdo, $patient_id, $password) {
    $sql = "SELECT * FROM patients WHERE patient_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$patient_id]);

    if ($stmt->rowCount() == 1) {
        $patientInfoRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $passwordFromDB = $patientInfoRow['password'];

        if (password_verify($password, $passwordFromDB)) {
            $pdo->beginTransaction();

            try {
                $deleteMedicationsSql = "DELETE FROM medications WHERE patient_id = ?";
                $deleteMedicationsStmt = $pdo->prepare($deleteMedicationsSql);
                $deleteMedicationsStmt->execute([$patient_id]);

                $deleteBpReadingsSql = "DELETE FROM bp_readings WHERE patient_id = ?";
                $deleteBpReadingsStmt = $pdo->prepare($deleteBpReadingsSql);
                $deleteBpReadingsStmt->execute([$patient_id]);

                $deletePatientSql = "DELETE FROM patients WHERE patient_id = ?";
                $deletePatientStmt = $pdo->prepare($deletePatientSql);
                $deletePatientStmt->execute([$patient_id]);

                $pdo->commit();

                return [
                    "success" => true,
                    "message" => "Account and related data deleted successfully"
                ];
            } catch (Exception $e) {
                $pdo->rollBack();

                return [
                    "success" => false,
                    "message" => "An error occurred while deleting the account and related data: " . $e->getMessage()
                ];
            }
        } else {
            return [
                "success" => false,
                "message" => "Password is incorrect"
            ];
        }
    } else {
        return [
            "success" => false,
            "message" => "Patient not found"
        ];
    }
}

function getMedicationList($pdo, $patient_id, $start_date = null, $end_date = null) {
    $sql = "SELECT * FROM medications WHERE patient_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$patient_id]);
    
    if ($stmt->rowCount() > 0) {
        $medications = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // If date range is specified, filter the dates in each medication
        if ($start_date && $end_date) {
            $start_moment = new DateTime($start_date);
            $end_moment = new DateTime($end_date);

            $end_moment->setTime(23, 59, 59);
            
            $medications = array_map(function($medication) use ($start_moment, $end_moment) {
                $all_dates = json_decode($medication["dates"], true);
                $all_actions = json_decode($medication["actions"], true);
                
                // Filter dates within the range
                $filtered_dates = [];
                if (is_array($all_dates)) {
                    foreach ($all_dates as $date) {
                        $date_moment = DateTime::createFromFormat('m/d/Y', $date);
                        if ($date_moment && $date_moment >= $start_moment && $date_moment <= $end_moment) {
                            $filtered_dates[] = $date;
                        }
                    }
                }
                
                // Filter actions that correspond to the filtered dates
                $filtered_actions = [];
                if (is_array($all_actions)) {
                    foreach ($all_actions as $action) {
                        if (in_array($action['date'], $filtered_dates)) {
                            $filtered_actions[] = $action;
                        }
                    }
                }
                
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
                    "dates" => $filtered_dates,
                    "actions" => $filtered_actions
                ];
            }, $medications);
            
            // Remove medications that have no dates in the range
            $medications = array_filter($medications, function($med) {
                return !empty($med["dates"]);
            });
            
            // Re-index array after filtering
            $medications = array_values($medications);
        } else {
            // If no date range, just format the data
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
                    "dates" => json_decode($medication["dates"]),
                    "actions" => json_decode($medication["actions"])
                ];
            }, $medications);
        }
        
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

function getBpList($pdo, $patient_id, $start_date = null, $end_date = null) {
    // Get all BP readings for the patient
    $sql = "SELECT * FROM bp_readings WHERE patient_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$patient_id]);

    if ($stmt->rowCount() > 0) {
        $bp_readings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // If date range is specified, filter the readings
        if ($start_date && $end_date) {
            // Convert start and end dates to DateTime objects for comparison
            $start_moment = new DateTime($start_date);
            $end_moment = new DateTime($end_date);
            
            // Set the end date to the end of the day for inclusive comparison
            $end_moment->setTime(23, 59, 59);
            
            // Filter readings within the date range
            $filtered_readings = [];
            
            foreach ($bp_readings as $reading) {
                // Convert date_taken (e.g., "Mar 28, 2025") to a DateTime object
                $reading_date = DateTime::createFromFormat('M j, Y', $reading["date_taken"]);
                
                // If date parsing fails, try alternative formats
                if (!$reading_date) {
                    // Try other possible formats
                    $formats = ['F j, Y', 'M d, Y', 'Y-m-d', 'm/d/Y'];
                    
                    foreach ($formats as $format) {
                        $reading_date = DateTime::createFromFormat($format, $reading["date_taken"]);
                        if ($reading_date) break;
                    }
                    
                    // If still can't parse, skip this reading
                    if (!$reading_date) continue;
                }
                
                // Set time to beginning of day for fair comparison
                $reading_date->setTime(0, 0, 0);
                
                // Check if the reading date is within the specified range
                if ($reading_date >= $start_moment && $reading_date <= $end_moment) {
                    $filtered_readings[] = $reading;
                }
            }
            
            // Use the filtered readings
            $bp_readings = $filtered_readings;
        }
        
        // Format the readings for response
        $bp_readings = array_map(function($bp_reading) {
            return [
                "readingId" => $bp_reading["reading_id"],
                "patientId" => $bp_reading["patient_id"],
                "dateTaken" => $bp_reading["date_taken"],
                "timeTaken" => $bp_reading["time_taken"],
                "systolic" => round($bp_reading["systolic"], 1),
                "diastolic" => round($bp_reading["diastolic"], 1),
                "pulseRate" => round($bp_reading["pulse_rate"], 1),
                "comments" => $bp_reading["comments"]
            ];
        }, $bp_readings);

        return [
            "success" => true,
            "bpList" => $bp_readings
        ];
    } else {
        return [
            "success" => false,
            "message" => "No blood pressure data."
        ];
    }
}

function deleteMedicationById($pdo, $medication_id, $date_today) {
    // 1. Get current medication data
    $stmt = $pdo->prepare("SELECT dates, actions FROM medications WHERE medication_id = ?");
    $stmt->execute([$medication_id]);
    $medication = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$medication) {
        return ["success" => false, "message" => "Medication not found"];
    }

    // 2. Process dates and actions
    $dates = json_decode($medication['dates'], true);
    $actions = json_decode($medication['actions'] ?? '[]', true);
    $today = DateTime::createFromFormat('m/d/Y', $date_today);

    // Filter dates
    $filteredDates = array_filter($dates, function($date) use ($today, $actions) {
        $dateObj = DateTime::createFromFormat('m/d/Y', $date);
        
        // Keep historical dates regardless of actions
        if ($dateObj < $today) return true;
        
        // Keep future dates only with actions
        foreach ($actions as $action) {
            if ($action['date'] === $date) return true;
        }
        return false;
    });

    // 3. Delete if no actions remain or all dates removed
    if (empty($actions) || empty($filteredDates)) {
        $deleteStmt = $pdo->prepare("DELETE FROM medications WHERE medication_id = ?");
        $success = $deleteStmt->execute([$medication_id]);
        
        return $success 
            ? ["success" => true, "message" => "Medication deleted successfully"]
            : ["success" => false, "message" => "Failed to delete medication"];
    }

    // 4. Update remaining dates and end_date
    $sortedDates = array_values($filteredDates);
    $updateStmt = $pdo->prepare("UPDATE medications 
                                SET dates = ?, end_date = ?
                                WHERE medication_id = ?");
    $success = $updateStmt->execute([
        json_encode($sortedDates),
        end($sortedDates), // New end_date
        $medication_id
    ]);

    return $success 
        ? ["success" => true, "message" => "Future medications cleared successfully"]
        : ["success" => false, "message" => "Failed to update medications"];
}

// ADMIN FUNCTIONS
function adminLogin($pdo, $email, $password) {
    global $encryption_key;
    
    $email_hash = hash('sha256', $email); 
    
    $sql = "SELECT * FROM admin WHERE email_hash = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email_hash]); 

    if ($stmt->rowCount() == 1) {
        $adminInfoRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $adminIDFromDB = $adminInfoRow['admin_id']; 
        $passwordFromDB = $adminInfoRow['password'];

        if (password_verify($password, $passwordFromDB)) {
            $_SESSION['admin_id'] = $adminIDFromDB;
            
            return [
                "id"      =>  $adminIDFromDB,
                "message" => "Login successful!",
                "success" => true, 
            ];
        } 
        
        return [
            "success" => false, 
            "message" => "Email/Password is incorrect."
        ];
    } else {
        return [
            "success" => false, 
            "message" => "Email/Password is incorrect."
        ];
    }
}

function getAllDoctors($pdo) {
    global $encryption_key;
    
    $sql = "SELECT * FROM doctors";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $doctors = array_map(function($doctor) use ($encryption_key) {
            return [
                "doctorId" => $doctor["doctor_id"],
                "fullName" => decryptData($doctor["full_name"], $encryption_key),
                "firstName" => decryptData($doctor["first_name"], $encryption_key),
                "lastName" => decryptData($doctor["last_name"], $encryption_key),
                "email" => decryptData($doctor["email"], $encryption_key),
            ];
        }, $doctors);
        return [
            "success" => true,
            "doctors" => $doctors
        ];
    } else {
        return [
            "success" => false,
            "message" => "No doctors found"
        ];
    }
}

function registerDoctor($pdo, $email, $password, $first_name, $last_name, $full_name) {
    global $encryption_key;
    
    $encrypted_email = encryptData($email, $encryption_key);
    $encrypted_first_name = encryptData($first_name, $encryption_key);
    $encrypted_last_name = encryptData($last_name, $encryption_key);
    $encrypted_full_name = encryptData($full_name, $encryption_key);
    $email_hash = hash('sha256', $email); 
    
    $checkUserSql = "SELECT * FROM doctors WHERE email_hash = ?";
    $checkUserSqlStmt = $pdo->prepare($checkUserSql);
    $checkUserSqlStmt->execute([$email_hash]);

    if ($checkUserSqlStmt->rowCount() == 0) {
        $sql = "INSERT INTO doctors (email,password,first_name,last_name,full_name,email_hash) VALUES(?,?,?,?,?,?)";
        $stmt = $pdo->prepare($sql);
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $executeQuery = $stmt->execute([$encrypted_email, $password_hash, $encrypted_first_name, $encrypted_last_name, $encrypted_full_name,$email_hash]);

        if ($executeQuery) {
            return [
                "success" => true, 
                "message" => "Doctor successfully registered!" 
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
            "message" => "Doctor already exists" 
        ];
    }
}

function deleteDoctorById($pdo, $doctor_id) {
    $sql = "DELETE FROM doctors WHERE doctor_id = ?";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$doctor_id]);

    if ($executeQuery) {
        return [
            "success" => true,
            "message" => "Doctor deleted successfully"
        ];
    } else {
        return [
            "success" => false,
            "message" => "An error occurred while deleting the doctor"
        ];
    }
}

function registerAdmin($pdo, $email, $password) {
    global $encryption_key;
    
    $email_hash = hash('sha256', $email); 
    
    $sql = "SELECT * FROM admin WHERE email_hash = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$email_hash]);
    
    if ($stmt->rowCount() == 0) {
        $encrypted_email = encryptData($email, $encryption_key);

        $sql = "INSERT INTO admin (email,password,email_hash) VALUES(?,?,?)";
        $stmt = $pdo->prepare($sql);
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $executeQuery = $stmt->execute([$encrypted_email, $password_hash,$email_hash]);

        if ($executeQuery) {
            return [
                "success" => true, 
                "message" => "Admin successfully registered!" 
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
            "message" => "Admin already exists" 
        ];
    }
}

function updateAdminAccount($pdo, $admin_id, $email, $password) {
    global $encryption_key;

    $email_hash = hash('sha256', $email);
    
    $checkSql = "SELECT admin_id FROM admin WHERE email_hash = ? AND admin_id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$email_hash, $admin_id]);
    
    if ($checkStmt->rowCount() > 0) {
        return [
            "success" => false,
            "message" => "Email already in use by another admin"
        ];
    }

    $encrypted_email = encryptData($email, $encryption_key);
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    $sql = "UPDATE admin SET email = ?, password = ?, email_hash = ? WHERE admin_id = ?";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$encrypted_email, $password_hash, $email_hash, $admin_id]);

    if ($executeQuery) {
        return [
            "success" => true,
            "message" => "Admin account updated successfully"
        ];
    } else {
        return [
            "success" => false,
            "message" => "An error occurred while updating the admin account"
        ];
    }
}

function getAdminAccount($pdo, $admin_id) {
    global $encryption_key;
    
    $sql = "SELECT * FROM admin WHERE admin_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$admin_id]);

    if($stmt->rowCount() > 0) {
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            "success" => true,
            "email" => decryptData($admin["email"], $encryption_key),
            ];
    } else {
        return [
            "success" => false,
            "message" => "Admin not found"
        ];
    }
}

function deleteAdminById($pdo, $admin_id) {
    $sql = "DELETE FROM admin WHERE admin_id = ?";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$admin_id]);

    if ($executeQuery) {
        return [
            "success" => true,
            "message" => "Admin deleted successfully"
        ];
    } else {
        return [
            "success" => false,
            "message" => "An error occurred while deleting the admin"
        ];
    }
}

function getAllAdmin($pdo) {
    global $encryption_key;
    
    $sql = "SELECT * FROM admin";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $admins = array_map(function($admin) use ($encryption_key) {
            return [
                "adminId" => $admin["admin_id"],
                "email" => decryptData($admin["email"], $encryption_key),
            ];
        }, $admins);
        return [
            "success" => true,
            "admins" => $admins
        ];
    } else {
        return [
            "success" => false,
            "message" => "No admins found"
        ];
    }
}

function updateAdminPassword($pdo, $admin_id, $old_password, $new_password) {
    $sql = "SELECT * FROM admin WHERE admin_id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$admin_id]);

    if ($stmt->rowCount() == 1) {
        $adminInfoRow = $stmt->fetch(PDO::FETCH_ASSOC);
        $passwordFromDB = $adminInfoRow['password'];

        if (password_verify($old_password, $passwordFromDB)) {
            $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);

            $updateSql = "UPDATE admin SET password = ? WHERE admin_id = ?";
            $updateStmt = $pdo->prepare($updateSql);
            $executeQuery = $updateStmt->execute([$new_password_hash, $admin_id]);

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
            "message" => "Admin not found"
        ];
    }
}