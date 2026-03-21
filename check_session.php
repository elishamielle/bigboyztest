<?php
session_start();
require 'db.php'; 

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    $uid = $_SESSION['user_id'];
    
    // Translated to PostgreSQL
    $query = "SELECT email FROM users WHERE id = $1";
    $result = pg_query_params($conn, $query, array($uid));
    
    if ($result && pg_num_rows($result) > 0) {
        $user = pg_fetch_assoc($result);
        
        echo json_encode([
            "status" => "logged_in", 
            "user_id" => $uid, 
            "name" => $_SESSION['name'],
            "email" => $user['email'], 
            "role" => $_SESSION['role']
        ]);
    } else {
        echo json_encode(["status" => "logged_out"]);
    }
} else {
    echo json_encode(["status" => "logged_out"]);
}

// Close PostgreSQL connection
pg_close($conn);
?>