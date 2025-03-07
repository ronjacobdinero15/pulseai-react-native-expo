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

function loginPatient($pdo, $email, $password) {
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
    
    // Encode the selected date as a JSON string (e.g., "2025-03-02" becomes "\"2025-03-02\"")
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
    // Fetch the current actions array
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


/* function updateShelf($pdo, $shelf_id, $shelf_name, $updatedBy) {
    $sql = "UPDATE shelves SET shelf_name = ?, updated_by = ?, last_updated = NOW() WHERE shelf_id = ?";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$shelf_name, $updatedBy, $shelf_id]);

    if ($executeQuery) {
        return true;
    }
}



function insertNewUser($pdo, $email, $password, $age, $gender, $bmi_height_cm, $bmi_weight_kg, $parental_hypertension, $lifestyle) {
    $checkUserSql = "SELECT * FROM patients WHERE email = ?";
    $checkUserSqlStmt = $pdo->prepare($checkUserSql);
    $checkUserSqlStmt->execute([$email]);

    if ($checkUserSqlStmt->rowCount() == 0) {
        $sql = "INSERT INTO patients (email,password,age,gender,bmi_height_cm,bmi_weight_kg,parental_hypertension,lifestyle) VALUES(?,?,?,?,?,?,?,?)";
        $stmt = $pdo->prepare($sql);
        
        $executeQuery = $stmt->execute([$email, $password, $age, $gender, $bmi_height_cm, $bmi_weight_kg, $parental_hypertension, $lifestyle]);

        if ($executeQuery) {
            return [
                "success" => true, 
                "message" => "User successfully registered!" 
            ];
        }
        else {
            return [
                "success" => false, 
                "message" => "An error occurred from the query" 
            ];
        }
    }
    else {
        return [
            "success" => false, 
            "message" => "User already exists" 
        ];
    }
}



function getAllUsers($pdo) {
	$sql = "SELECT * FROM user_passwords";
	$stmt = $pdo->prepare($sql);
	$executeQuery = $stmt->execute();

	if ($executeQuery) {
		return $stmt->fetchAll();
	}
}



function getUserByID($pdo, $user_id) {
	$sql = "SELECT * FROM user_passwords WHERE user_id = ?";
	$stmt = $pdo->prepare($sql);
	$executeQuery = $stmt->execute([$user_id]);
	if ($executeQuery) {
        return $stmt->fetch(PDO::FETCH_ASSOC);
	}
}



function getCurrentUser() { 
    return [
        "username" => $_SESSION['username'] ?? null
    ];
}



function insertNewUser($pdo, $username, $password, $email, $first_name, $last_name, $address, $age) {
    $checkUserSql = "SELECT * FROM user_passwords WHERE username = ?";
    $checkUserSqlStmt = $pdo->prepare($checkUserSql);
    $checkUserSqlStmt->execute([$username]);

    if ($checkUserSqlStmt->rowCount() == 0) {
        $sql = "INSERT INTO user_passwords (username,password,email,first_name,last_name,address,age) VALUES(?,?,?,?,?,?,?)";
        $stmt = $pdo->prepare($sql);
        $executeQuery = $stmt->execute([$username, $password, $email, $first_name, $last_name, $address, $age]);

        if ($executeQuery) {
            return [
                "success" => true, 
                "message" => "User successfully registered!" 
            ];
        }
        else {
            return [
                "success" => false, 
                "message" => "An error occurred from the query" 
            ];
        }
    }
    else {
        return [
            "success" => false, 
            "message" => "User already exists" 
        ];
    }
} 



function insertShelf($pdo, $shelf_name, $currentUser) {
    $sql = "INSERT INTO shelves (shelf_name, added_by) VALUES (?,?)";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$shelf_name, $currentUser]);

    if ($executeQuery) {
        return [
            "success" => true,
            "message" => "Shelf created successfully"
        ];
    }
    return [
        "success" => false,
        "message" => "Failed to create shelf"
    ];
}



function insertItem($pdo, $item_name, $price, $shelf_id, $currentUser) {
    $sql = "INSERT INTO items (item_name, price, shelf_id, added_by) VALUES (?,?,?,?)";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$item_name, $price, $shelf_id, $currentUser]);

    if ($executeQuery) {
        return true;
    }
}



function fetchShelf($pdo, $shelf_id) {
    $sql = "SELECT * FROM shelves WHERE shelf_id = ?";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$shelf_id]);
        
    if ($executeQuery) {
        return $stmt->fetch();
    }
}



function fetchItem($pdo, $item_id) {
    $sql = "SELECT * FROM items WHERE item_id = ?";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$item_id]);

    if ($executeQuery) {
        return $stmt->fetch();
    }
}



function fetchAllShelves($pdo) {
    $sql = "SELECT * FROM shelves ORDER BY shelf_id DESC";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute();

    if ($executeQuery) {
        return $stmt->fetchAll();
    }
}



function fetchItemsByShelf($pdo, $shelf_id) {
    $sql = "SELECT * FROM items WHERE shelf_id = ?";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$shelf_id]);
    
    if ($executeQuery) {
        return $stmt->fetchAll();
    }
}



function updateItem($pdo, $item_id, $item_name, $price, $updatedBy) {
    $sql = "UPDATE items SET item_name = ?, price = ?, updated_by = ?, last_updated = NOW() WHERE item_id = ?";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$item_name, $price, $updatedBy, $item_id]);

    if ($executeQuery) {
        return true;
    }
}



function deleteShelf($pdo, $shelf_id) {
    $sql = "DELETE FROM shelves WHERE shelf_id = ?";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$shelf_id]);

    if ($executeQuery) {
        return true;
    }
}



function deleteItem($pdo, $item_id) {
    $sql = "DELETE FROM items WHERE item_id = ?";
    $stmt = $pdo->prepare($sql);
    $executeQuery = $stmt->execute([$item_id]);

    if ($executeQuery) {
        return true;
    }
}
*/