<?php

require_once 'dbConfig.php';
require_once 'models.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    handleGet($pdo);
} elseif ($method === 'POST') {
    handlePost($pdo);
} elseif ($method === 'PUT') {
    handlePut($pdo);
} elseif ($method === 'DELETE') {
    handleDelete($pdo);
}

function handleGet($pdo) {
    switch ($_GET['action']) {
        case 'getMedicationList':
            echo json_encode(getMedicationList($pdo, $_GET['patient_id'], $_GET['selected_date']));
            break;
        case 'checkIfUserHasAlreadyBpToday':
            echo json_encode(checkIfUserHasAlreadyBpToday($pdo, $_GET['patient_id'], $_GET['date_taken']));
            break;
        case 'getPatientProfile':
            echo json_encode(getPatientProfile($pdo, $_GET['patient_id']));
            break;
        case 'getDoctorProfile':
            echo json_encode(getDoctorProfile($pdo, $_GET['doctor_id']));
            break;
        default:
            echo json_encode(['error' => 'Invalid action']);
    }
}

function handlePost($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);

    switch ($_GET['action']) {
        case 'patientLogin':
            echo json_encode(patientLogin($pdo, $data['email'], $data['password']));
            break;
        case 'doctorLogin':
            echo json_encode(doctorLogin($pdo, $data['email'], $data['password']));
            break;
        case 'registerPatient':
            echo json_encode(registerPatient($pdo, $data['first_name'], $data['last_name'], $data['full_name'], $data['date_of_birth'], $data['email'], $data['password'], $data['age'], $data['gender'], $data['bmi_height_cm'], $data['bmi_weight_kg'], $data['vices'], $data['comorbidities'], $data['parental_hypertension'], $data['lifestyle']));
            break;
        case 'forgotPassword':
            echo json_encode(forgotPassword($pdo, $data['email']));
            break;
        case 'addNewMedication':
            echo json_encode(addNewMedication($pdo, $data['medication_id'], $data['patient_id'], $data['medication_name'], $data['type'], $data['dosage'], $data['frequency'], $data['start_date'], $data['end_date'], $data['reminder'], $data['dates'], $data['actions']));
            break;
        case 'addNewMedicationStatus':
            echo json_encode(addNewMedicationStatus($pdo, $data['medication_id'], $data['date'], $data['status'], $data['time']));
            break;
        case 'addNewBpForToday':
            echo json_encode(addNewBpForToday($pdo, $data['patient_id'], $data['systolic'], $data['diastolic'], $data['date_taken']));
            break;
        default:
            echo json_encode(['error' => 'Invalid action']);
    }
}

function handlePut($pdo) {
    $data = json_decode(file_get_contents("php://input"), true);

    switch ($_GET['action']) {
        case 'updatePatientNeedsOnboarding':
            echo json_encode(updatePatientNeedsOnboarding($pdo, $data['patient_id'], $data['needs_onboarding']));
            break;
        case 'updatePatientProfile':
            echo json_encode(updatePatientProfile($pdo, $data['patient_id'], $data['first_name'], $data['last_name'], $data['full_name'], $data['date_of_birth'], $data['email'], $data['age'], $data['gender'], $data['bmi_height_cm'], $data['bmi_weight_kg'], $data['vices'], $data['comorbidities'], $data['parental_hypertension'], $data['lifestyle']));
            break;
        case 'updateDoctorProfile':
            echo json_encode(updateDoctorProfile($pdo, $data['doctor_id'], $data['first_name'], $data['last_name'], $data['full_name'], $data['email']));
            break;
        case 'updatePatientPassword':
            echo json_encode(updatePatientPassword($pdo, $data['patient_id'], $data['old_password'], $data['new_password']));
            break;
        case 'updateDoctorPassword':
            echo json_encode(updateDoctorPassword($pdo, $data['doctor_id'], $data['old_password'], $data['new_password']));
            break;
        default:
            echo json_encode(['error' => 'Invalid action']);
    }
}

/* function handleDelete($pdo) {
    if (isset($_GET['item_id'])) {
        echo json_encode(deleteItem($pdo, $_GET['item_id']));
    } elseif (isset($_GET['shelf_id'])) {
        echo json_encode(deleteShelf($pdo, $_GET['shelf_id']));
    }
}  */