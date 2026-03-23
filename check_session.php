<?php
error_reporting(0); 
session_start();
require 'db.php'; 
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    $uid = $_SESSION['user_id'];
    
    // checks  database for the email
    $query = "SELECT email FROM users WHERE id = $1";
    $result = pg_query_params($conn, $query, array($uid));
    
    $email = "No email found";
    if ($result && pg_num_rows($result) > 0) {
        $user = pg_fetch_assoc($result);
        $email = $user['email']; // gets the email
    }

    echo json_encode([
        "status" => "logged_in", 
        "user_id" => $uid, 
        "name" => $_SESSION['name'] ?? "User",
        "email" => $email, 
        "role" => $_SESSION['role'] ?? "user"
    ]);
} else {
    echo json_encode(["status" => "logged_out"]);
}

pg_close($conn);
?>