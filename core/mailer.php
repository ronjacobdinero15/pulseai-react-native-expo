<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . "/../vendor/autoload.php";

$mail = new PHPMailer(true);

try {
    $mail->SMTPDebug = 0; 
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'ucosthesis@gmail.com'; 
    $mail->Password = 'hdrp gkmh mahh qols';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom('noreply@pulseai.com', 'PulseAI Hypertension Application'); 
    $mail->isHTML(true);

    return $mail;
} catch (Exception $e) {
    echo "Mailer Error: {$mail->ErrorInfo}";
}