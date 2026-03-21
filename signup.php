<?php
header('Content-Type: application/json'); 
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $name = $data['name']; 
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT); 

    $checkEmail = pg_query_params($conn, "SELECT * FROM users WHERE email = $1", array($email));
    
    if (pg_num_rows($checkEmail) > 0) {
        echo json_encode(["status" => "error", "message" => "Email is already registered!"]);
    } else {
        $sql = "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)";
        $result = pg_query_params($conn, $sql, array($name, $email, $password, 'user'));
        
        if ($result) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database error."]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "No data received."]);
}
pg_close($conn);
?>