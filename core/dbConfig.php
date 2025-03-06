<?php
require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$host = $_ENV['EXPO_PUBLIC_DB_HOSTNAME'];
$user = $_ENV['EXPO_PUBLIC_DB_USERNAME'];
$password = $_ENV['EXPO_PUBLIC_DB_PASSWORD'];
$dbname = $_ENV['EXPO_PUBLIC_DB_NAME'];

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_PERSISTENT => false
        ]
    );
} catch (PDOException $e) {
    error_log("[" . date('Y-m-d H:i:s') . "] DB Error: " . $e->getMessage());
    die("Server maintenance in progress. Please try again later.");
}

return $pdo;

?>