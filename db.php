<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "bigboyz_db"; // Make sure this matches your DB name

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Connection failed"]));
}
?>