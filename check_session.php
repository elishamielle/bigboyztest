<?php
error_reporting(0); // 🟢 Hides warnings so JSON stays clean
session_start();
require 'db.php';

// We only need the Session data to update the Navbar! 
// No need to query the database every time.
if (isset($_SESSION['user_id']) && isset($_SESSION['name'])) {
    echo json_encode([
        "status" => "logged_in",
        "user_id" => $_SESSION['user_id'],
        "name" => $_SESSION['name'],
        "role" => $_SESSION['role'] ?? 'user'
    ]);
} else {
    echo json_encode(["status" => "logged_out"]);
}
?>