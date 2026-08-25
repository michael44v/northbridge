<?php
require_once 'backend/config.php';
require_once 'backend/Security.php';

$db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$hash = Security::hashData('AdminPass123!');
$db->query("UPDATE users SET password_hash = '$hash' WHERE email = 'admin@example.com'");
echo "Admin password updated!\n";
