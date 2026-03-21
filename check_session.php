<?php
session_start();
require 'db.php'; 

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    $uid = $_SESSION['user_id'];
    
    $stmt = $conn->prepare("SELECT email FROM users WHERE id = ?");
    $stmt->bind_param("i", $uid);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($user = $result->fetch_assoc()) {
        echo json_encode([
            "status" => "logged_in", 
            "user_id" => $uid, 
            "name" => $_SESSION['name'],
            "email" => $user['email'], // 🟢 Added missing comma here
            "role" => $_SESSION['role']
        ]);
    } else {
        echo json_encode(["status" => "logged_out"]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "logged_out"]);
}

$conn->close();
?>