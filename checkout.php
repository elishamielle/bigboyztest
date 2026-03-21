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

// 3. Connect to Database
require 'db.php';

try {
    // 4. HANDLE THE FILE UPLOAD
    $receipt_name = ""; 
    if (isset($_FILES['receipt']) && $_FILES['receipt']['error'] === UPLOAD_ERR_OK) {
        $target_dir = "uploads/";
        // Ensure directory exists
        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0755, true); 
        }

        $file_ext = pathinfo($_FILES["receipt"]["name"], PATHINFO_EXTENSION);
        $receipt_name = "receipt_" . time() . "_" . $_SESSION['user_id'] . "." . $file_ext;
        
        if (!move_uploaded_file($_FILES["receipt"]["tmp_name"], $target_dir . $receipt_name)) {
            // If move fails, we proceed with empty name or handle error
            $receipt_name = "upload_failed_" . $receipt_name;
        }
    }

    // 5. PREPARE DATA
    $user_id = $_SESSION['user_id'];
    $items_json = $_POST['items']; 
    $total = (float)$_POST['total']; // Force it to be a number
    $notes = isset($_POST['notes']) ? $_POST['notes'] : ""; 
    $status = 'Pending';

    // 6. INSERT (Explicitly casting $3 to numeric for Postgres safety)
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
        // This grabs the actual PostgreSQL error message
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