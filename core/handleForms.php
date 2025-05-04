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
        case 'getAllPatients':
            echo json_encode(getAllPatients($pdo));
            break;
        case 'getPatientsList':
            echo json_encode(getPatientsList($pdo, $_GET['doctor_id']));
            break;
        case 'getMedicationListForSelectedDate':
            echo json_encode(getMedicationListForSelectedDate($pdo, $_GET['patient_id'], $_GET['selected_date']));
            break;
        case 'getMedicationList':
            $start_date = $_GET['start_date'] ?? null;
            $end_date = $_GET['end_date'] ?? null;
            
            echo json_encode(getMedicationList($pdo, $_GET['patient_id'], $start_date, $end_date));
            break;
        case 'getBpList':
            $start_date = $_GET['start_date'] ?? null;
            $end_date = $_GET['end_date'] ?? null;
            
            echo json_encode(getBpList($pdo, $_GET['patient_id'], $start_date, $end_date));
            break;
        case 'getBpForTodayList':
            echo json_encode(getBpForTodayList($pdo, $_GET['patient_id'], $_GET['date_taken']));
            break;
        case 'getPatientProfile':
            echo json_encode(getPatientProfile($pdo, $_GET['patient_id']));
            break;
        case 'getDoctorProfile':
            echo json_encode(getDoctorProfile($pdo, $_GET['doctor_id']));
            break;
        case 'getAllDoctors':
            echo json_encode(getAllDoctors($pdo));
            break;
        case 'getAdminAccount':
            echo json_encode(getAdminAccount($pdo, $_GET['admin_id']));
            break;
        case 'getAllAdmin':
            echo json_encode(getAllAdmin($pdo));
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
            echo json_encode(registerPatient($pdo, $data['first_name'], $data['last_name'], $data['full_name'], $data['date_of_birth'], $data['contact'], $data['address'], $data['email'], $data['password'], $data['age'], $data['gender'], $data['bmi_height_cm'], $data['bmi_weight_kg'], $data['vices'], $data['comorbidities'], $data['parental_hypertension'], $data['lifestyle']));
            break;
        case 'forgotPassword':
            echo json_encode(forgotPassword($pdo, $data['email'], $data['table_name']));
            break;
        case 'addNewMedication':
            echo json_encode(addNewMedication($pdo, $data['medication_id'], $data['patient_id'], $data['medication_name'], $data['type'], $data['dosage'], $data['frequency'], $data['start_date'], $data['end_date'], $data['reminder'], $data['dates'], $data['actions']));
            break;
        case 'addNewMedicationStatus':
            echo json_encode(addNewMedicationStatus($pdo, $data['medication_id'], $data['date'], $data['status'], $data['time']));
            break;
        case 'addNewBp':
            echo json_encode(addNewBp($pdo, $data['patient_id'], $data['date_taken'], $data['time_taken'], $data['systolic'], $data['diastolic'], $data['pulse_rate'], $data['comments']));
            break;
        case 'deletePatientAccountAndData':
            echo json_encode(deletePatientAccountAndData($pdo, $data['patient_id'], $data['password']));
            break;
        case 'adminLogin':
            echo json_encode(adminLogin($pdo, $data['email'], $data['password']));
            break;
        case 'registerDoctor':
            echo json_encode(registerDoctor($pdo, $data['email'], $data['password'], $data['first_name'], $data['last_name'], $data['full_name']));
            break;
        case 'registerAdmin':
            echo json_encode(registerAdmin($pdo, $data['email'], $data['password']));
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
            echo json_encode(updatePatientProfile($pdo, $data['patient_id'], $data['first_name'], $data['last_name'], $data['full_name'], $data['date_of_birth'], $data['contact'], $data['address'], $data['email'], $data['age'], $data['gender'], $data['bmi_height_cm'], $data['bmi_weight_kg'], $data['vices'], $data['comorbidities'], $data['parental_hypertension'], $data['lifestyle']));
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
        case 'updateAdminAccount':
            echo json_encode(updateAdminAccount($pdo, $data['admin_id'], $data['email'], $data['password']));
            break;
        case 'updateAdminPassword':
            echo json_encode(updateAdminPassword($pdo, $data['admin_id'], $data['old_password'], $data['new_password']));
            break;
        case 'updateGenerateReport':
            echo json_encode(updateGenerateReport($pdo, $data['patient_id']));
            break;
        case 'updateSurveyAnswered':
            echo json_encode(updateSurveyAnswered($pdo, $data['patient_id']));
            break;
        case 'deleteMedicationById':
            echo json_encode(deleteMedicationById($pdo, $_GET['medication_id'], $_GET['date_today']));
            break;
        default:
            echo json_encode(['error' => 'Invalid action']);
    }
}

function handleDelete($pdo) {
    switch ($_GET['action']) {
        case 'deleteDoctorById':
            echo json_encode(deleteDoctorById($pdo, $_GET['doctor_id']));
            break;
        case 'deleteAdminById':
            echo json_encode(deleteAdminById($pdo, $_GET['admin_id']));
            break;
        default:
            echo json_encode(['error' => 'Invalid action']);
    }
} 