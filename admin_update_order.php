<?php
session_start();
require 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($_SESSION['role']) && $_SESSION['role'] === 'admin' && isset($data['order_id']) && isset($data['status'])) {
    $order_id = $data['order_id'];
    $status = $data['status'];

    $sql = "UPDATE orders SET status = $1 WHERE id = $2";
    $result = pg_query_params($conn, $sql, array($status, $order_id));

    if ($result) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update the database']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized or missing data']);
}
pg_close($conn);
?>