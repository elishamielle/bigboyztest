<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
    exit;
}

$sql = "SELECT o.id, o.items, o.total, o.notes, o.receipt_image, o.status, o.created_at, o.completed_at, u.name as customer_name 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC";
$result = pg_query($conn, $sql);

$orders = [];
if ($result) {
    while ($row = pg_fetch_assoc($result)) {
        $row['items'] = json_decode($row['items'], true);
        $orders[] = $row;
    }
    echo json_encode(['status' => 'success', 'orders' => $orders]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
}
pg_close($conn);
?>