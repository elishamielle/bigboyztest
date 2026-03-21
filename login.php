<?php
session_start(); 
require 'db.php'; // Ensure this file has your correct DB credentials

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];

    // We select everything, including the 'role' column you added in phpMyAdmin
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // Check if the password is correct
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['role'] = $user['role']; // 🟢 THIS IS THE CRITICAL LINE
            
            echo json_encode([
                "status" => "success", 
                "role" => $user['role']
            ]);
        } 
        else {
            echo json_encode(["status" => "error", "message" => "Incorrect password!"]);
        }
    } else {
         echo json_encode(["status" => "error", "message" => "Email not found!"]);
    }
}
$conn->close();
?>