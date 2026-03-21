<?php
session_start();
header('Content-Type: application/json');

// 1. Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

// 2. Check if cart has data
if (!isset($_POST['items']) || empty($_POST['items'])) {
    echo json_encode(['status' => 'error', 'message' => 'Cart is empty']);
    exit;
}

// 3. Connect to Render PostgreSQL database
require 'db.php';

// 4. HANDLE THE FILE UPLOAD (Receipt Image)
$receipt_name = ""; 
if (isset($_FILES['receipt'])) {
    $target_dir = "uploads/";
    if (!is_dir($target_dir)) mkdir($target_dir, 0777, true); // Create folder if it doesn't exist

    $file_ext = pathinfo($_FILES["receipt"]["name"], PATHINFO_EXTENSION);
    $receipt_name = "receipt_" . time() . "_" . $_SESSION['user_id'] . "." . $file_ext;
    
    move_uploaded_file($_FILES["receipt"]["tmp_name"], $target_dir . $receipt_name);
}

// 5. PREPARE THE DATA 
$user_id = $_SESSION['user_id'];
$items_json = $_POST['items']; 
$total = $_POST['total'];      
$notes = isset($_POST['notes']) ? $_POST['notes'] : ""; 
$status = 'Pending';

// 6. INSERT INTO YOUR 'orders' TABLE
$sql = "INSERT INTO orders (user_id, items, total, notes, receipt_image, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
$result = pg_query_params($conn, $sql, array($user_id, $items_json, $total, $notes, $receipt_name, $status));

if ($result) {
    // Grab the ID of the order we just created
    $row = pg_fetch_assoc($result);
    echo json_encode([
        'status' => 'success', 
        'message' => 'Order placed successfully!', 
        'order_id' => $row['id']
    ]);
} else {
    echo json_encode([
        'status' => 'error', 
        'message' => 'Database error.'
    ]);
}

pg_close($conn);
?>