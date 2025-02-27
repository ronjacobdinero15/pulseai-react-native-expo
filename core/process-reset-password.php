<?php
$token = $_POST["token"] ?? '';

if (!$token) {
    die("Invalid token");
}

$token_hash = hash("sha256", $token);

$pdo = require __DIR__ . "/dbConfig.php";

if (!$pdo) {
    die("Database connection failed");
}

$sql = "SELECT * FROM patients WHERE reset_token_hash = :token_hash";
$stmt = $pdo->prepare($sql);
$stmt->execute(['token_hash' => $token_hash]);

$patient = $stmt->fetch(PDO::FETCH_ASSOC);

if ($patient === false) {
    die("Token not found");
}

if (strtotime($patient["reset_token_expires_at"]) <= time()) {
    die("Token has expired");
}

if (strlen($_POST["password"]) < 8) {
    die("Password must be at least 8 characters");
}

if (!preg_match("/[a-z]/i", $_POST["password"])) {
    die("Password must contain at least one letter");
}

if (!preg_match("/[0-9]/", $_POST["password"])) {
    die("Password must contain at least one number");
}

if ($_POST["password"] !== $_POST["password_confirmation"]) {
    die("Passwords must match");
}

$password_hash = password_hash($_POST["password"], PASSWORD_DEFAULT);

$sql = "UPDATE patients
        SET password = :password_hash,
            reset_token_hash = NULL,
            reset_token_expires_at = NULL
        WHERE patient_id = :patient_id";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    'password_hash' => $password_hash,
    'patient_id' => $patient["patient_id"]
]);

echo "Password updated. Please return and login to the app";