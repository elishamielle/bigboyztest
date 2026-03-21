<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$conn = new mysqli("localhost", "root", "", "bigboyz_db");

$user_id = $_SESSION['user_id'];
// Fetch orders sorted by newest first
$sql = "SELECT items, total, status, notes, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    $row['items'] = json_decode($row['items'], true); // Turn the JSON string back into an array
    $orders[] = $row;
}

echo json_encode(['status' => 'success', 'orders' => $orders]);

$stmt->close();
$conn->close();
?>