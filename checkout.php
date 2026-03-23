<?php
error_reporting(0); 
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

// Check if cart has items
if (!isset($_POST['items']) || empty($_POST['items'])) {
    echo json_encode(['status' => 'error', 'message' => 'Cart is empty']);
    exit;
}

// Connect to Database
require 'db.php';

try {
    $receipt_name = ""; 
    if (isset($_FILES['receipt']) && $_FILES['receipt']['error'] === UPLOAD_ERR_OK) {
        $tmp_path = $_FILES["receipt"]["tmp_name"];
        
        // Read the image file and convert it to a Base64 text string
        $file_data = file_get_contents($tmp_path);
        $base64 = base64_encode($file_data);
        
        // Detect if it is a PNG, JPG, etc.
        $mime = mime_content_type($tmp_path);
        if (!$mime) { $mime = "image/jpeg"; }
        
        // Create the final text string that browsers can read as an image
        $receipt_name = "data:" . $mime . ";base64," . $base64;
    }

    // data
    $user_id = $_SESSION['user_id'];
    $items_json = $_POST['items']; 
    $total = (float)$_POST['total']; 
    $notes = isset($_POST['notes']) ? $_POST['notes'] : ""; 
    $status = 'Pending';

    $sql = "INSERT INTO orders (user_id, items, total, notes, receipt_image, status) 
            VALUES ($1, $2, $3::numeric, $4, $5, $6) RETURNING id";
    
    $result = pg_query_params($conn, $sql, array($user_id, $items_json, $total, $notes, $receipt_name, $status));

    if ($result) {
        $row = pg_fetch_assoc($result);
        echo json_encode([
            'status' => 'success', 
            'message' => 'Order placed successfully!', 
            'order_id' => $row['id']
        ]);
    } else {
        // This grabs PostgreSQL error message
        echo json_encode([
            'status' => 'error', 
            'message' => 'DB Error: ' . pg_last_error($conn)
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Server Error: ' . $e->getMessage()
    ]);
}

pg_close($conn);
?>