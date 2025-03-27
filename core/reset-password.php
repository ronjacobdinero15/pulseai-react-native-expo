<?php
$token = $_GET["token"] ?? '';
$table_name = $_GET["table_name"] ?? '';

if (!$token) {
    die("Invalid token");
}

$token_hash = hash("sha256", $token);

$pdo = require __DIR__ . "/dbConfig.php";

if (!$pdo) {
    die("Database connection failed");
}

$sql = "SELECT * FROM $table_name WHERE reset_token_hash = :token_hash";
$stmt = $pdo->prepare($sql);
$stmt->execute(['token_hash' => $token_hash]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user === false) {
    die("Token not found");
}

if (strtotime($user["reset_token_expires_at"]) <= time()) {
    die("Token has expired");
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/light.css">
</head>
<body>
    <h1>Reset Password</h1>

    <form method="post" action="process-reset-password.php">
        <input type="hidden" name="token" value="<?= htmlspecialchars($token) ?>">
        <input type="hidden" name="table_name" value="<?= htmlspecialchars($table_name) ?>">

        <label for="password">New password</label>
        <input type="password" id="password" name="password">

        <label for="password_confirmation">Repeat password</label>
        <input type="password" id="password_confirmation" name="password_confirmation">

        <button>Send</button>
    </form>
</body>
</html>