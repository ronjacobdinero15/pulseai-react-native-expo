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
        /* case 'edit':
            echo json_encode(fetchShelf($pdo, $_GET['shelf_id']));
            break;
        case 'edit_item':
            echo json_encode(fetchItem($pdo, $_GET['item_id']));
            break;
        case 'shelf_data':
            echo json_encode(fetchItemsByShelf($pdo, $_GET['shelf_id']));
            break;
        case 'logout':
            unset($_SESSION['username']);
            break;
        case 'getAllUsers':
            echo json_encode(getAllUsers($pdo));
            break;
        case 'getUserByID':
            echo json_encode(getUserByID($pdo, $_GET['user_id']));
            break;
        case 'getShelves':
            echo json_encode(fetchAllShelves($pdo));
            break; */
        default:
            echo json_encode(['error' => 'Invalid action']);
    }
}

function handlePost($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);

    switch ($_GET['action']) {
        case 'loginPatient':
            echo json_encode(loginPatient($pdo, $data['email'], $data['password']));
            break;
        case 'registerPatient':
            echo json_encode(registerPatient($pdo, $data['first_name'], $data['last_name'], $data['date_of_birth'], $data['email'], $data['password'], $data['age'], $data['gender'], $data['bmi_height_cm'], $data['bmi_weight_kg'], $data['vices'], $data['comorbidities'], $data['parental_hypertension'], $data['lifestyle']));
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
        /* case 'insertShelf':
            echo json_encode(insertShelf($pdo, $data['shelf_name'], $data['currentUser']));
            break;
        case 'insertItem':
            echo json_encode(insertItem($pdo, $data['item_name'], $data['price'], $data['shelf_id'], $data['currentUser']));
            break;  */
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
        /* case 'updateItem':
            echo json_encode(updateItem($pdo, $data['item_id'], $data['item_name'], $data['price'], $data['updatedBy']));
            break; */
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