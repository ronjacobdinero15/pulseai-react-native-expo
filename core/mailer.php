<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . "/../vendor/autoload.php";

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$mail = new PHPMailer(true);

try {
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host = $_ENV['EXPO_PUBLIC_MAIL_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['EXPO_PUBLIC_MAIL_USERNAME'];
    $mail->Password = $_ENV['EXPO_PUBLIC_MAIL_PASSWORD'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom(
        $_ENV['EXPO_PUBLIC_MAIL_FROM'], 
        'PulseAI Hypertension Application'
    );
    $mail->isHTML(true);

    return $mail;
} catch (Exception $e) {
    error_log("[" . date('Y-m-d H:i:s') . "] Mail Error: " . $e->getMessage());
    die("Email service temporarily unavailable. Please try again later.");
}
?>