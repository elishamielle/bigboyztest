<?php
error_reporting(0);  
session_start();
require 'db.php'; 
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT id, items, total, status, notes, created_at FROM orders WHERE user_id = $1 ORDER BY created_at DESC";
$result = pg_query_params($conn, $sql, array($user_id));

if (!$result) {
    echo json_encode(['status' => 'error', 'message' => 'Database query failed']);
    exit;
}

$orders = [];
while ($row = pg_fetch_assoc($result)) {
    // Turn the JSON string from the database back into a PHP array for the frontend
    $row['items'] = json_decode($row['items'], true); 
    $orders[] = $row;
}

echo json_encode(['status' => 'success', 'orders' => $orders]);

pg_close($conn);
?>