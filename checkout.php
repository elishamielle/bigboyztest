<?php
session_start();
header('Content-Type: application/json');

// 1. Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

// 🟢 NEW SECTION 2: Get the data from $_POST instead of file_get_contents
// When using FormData in JS, PHP puts the data into the $_POST superglobal automatically.
if (!isset($_POST['items']) || empty($_POST['items'])) {
    echo json_encode(['status' => 'error', 'message' => 'Cart is empty']);
    exit;
}

// 3. Database Connection
$conn = new mysqli("localhost", "root", "", "bigboyz_db");

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

// 🟢 HANDLE THE FILE UPLOAD (Receipt Image)
$receipt_name = ""; 
if (isset($_FILES['receipt'])) {
    $target_dir = "uploads/";
    if (!is_dir($target_dir)) mkdir($target_dir, 0777, true); // Create folder if it doesn't exist

    $file_ext = pathinfo($_FILES["receipt"]["name"], PATHINFO_EXTENSION);
    $receipt_name = "receipt_" . time() . "_" . $_SESSION['user_id'] . "." . $file_ext;
    
    move_uploaded_file($_FILES["receipt"]["tmp_name"], $target_dir . $receipt_name);
}

// 🟢 PREPARE THE DATA FROM $_POST
$user_id = $_SESSION['user_id'];
$items_json = $_POST['items']; // Already stringified in payment.js
$total = $_POST['total'];      // Matches 'total' key in your FormData
$notes = isset($_POST['notes']) ? $_POST['notes'] : ""; 
$status = 'Pending';

// 4. INSERT INTO YOUR 'orders' TABLE
// Note: Added 'receipt_image' to the columns list
$stmt = $conn->prepare("INSERT INTO orders (user_id, items, total, notes, receipt_image, status) VALUES (?, ?, ?, ?, ?, ?)");

// "isdsss" = int, string, double, string, string, string
$stmt->bind_param("isdsss", $user_id, $items_json, $total, $notes, $receipt_name, $status);

if ($stmt->execute()) {
    echo json_encode([
        'status' => 'success', 
        'message' => 'Order placed successfully!', 
        'order_id' => $conn->insert_id
    ]);
} else {
    echo json_encode([
        'status' => 'error', 
        'message' => 'SQL Error: ' . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>