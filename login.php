<?php
session_start(); 
require 'db.php'; 

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $email = $data['email'];
    $password = $data['password'];

    $sql = "SELECT * FROM users WHERE email = $1";
    $result = pg_query_params($conn, $sql, array($email));

    if (pg_num_rows($result) > 0) {
        $user = pg_fetch_assoc($result);
        
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['role'] = $user['role']; 
            
            echo json_encode([
                "status" => "success", 
                "role" => $user['role']
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Incorrect password!"]);
        }
    } else {
         echo json_encode(["status" => "error", "message" => "Email not found!"]);
    }
}
pg_close($conn);
?>