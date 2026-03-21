<?php
session_start();
header('Content-Type: application/json');

// 1. Connect using Render's Environment Variables
$host = getenv('DB_HOST');
$db   = getenv('DB_NAME');
$user = getenv('DB_USER');
$pass = getenv('DB_PASSWORD');

$conn_str = "host=$host dbname=$db user=$user password=$pass sslmode=require";
$dbconn = pg_connect($conn_str);

if (!$dbconn) {
    echo json_encode(['status' => 'error', 'message' => 'Database Connection Failed']);
    exit;
}

// 2. Get Data from the frontend
$full_name = $_POST['full_name'];
$email = $_POST['email'];
$password = $_POST['password'];

// Hash the password for security
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// 3. Check if email already exists
$check_query = 'SELECT * FROM users WHERE email = $1';
$check_result = pg_query_params($dbconn, $check_query, array($email));

if (pg_num_rows($check_result) > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email is already registered!']);
    exit;
}

// 4. Insert new user into the database
$insert_query = 'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id';
$insert_result = pg_query_params($dbconn, $insert_query, array($full_name, $email, $hashed_password));

if ($insert_result) {
    // Automatically log them in after signing up
    $row = pg_fetch_assoc($insert_result);
    $_SESSION['user_id'] = $row['id'];
    $_SESSION['user_full_name'] = $full_name;
    
    echo json_encode(['status' => 'success', 'message' => 'Account created successfully!']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to create account.']);
}

pg_close($dbconn);
?>