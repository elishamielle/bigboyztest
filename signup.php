<?php
header('Content-Type: application/json'); // Tells the browser "I am sending JSON"
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $name = $conn->real_escape_string($data['name']); // Matched to your column
    $email = $conn->real_escape_string($data['email']);
    $password = password_hash($data['password'], PASSWORD_DEFAULT); // Encrypts the password

    // Check if email already exists
    $checkEmail = $conn->query("SELECT * FROM users WHERE email = '$email'");
    
    if ($checkEmail->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Email is already registered!"]);
    } else {
        $sql = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$password')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "No data received."]);
}
$conn->close();
?>