<?php
require 'db.php';

// Drop the old incorrect table
pg_query($conn, "DROP TABLE IF EXISTS users CASCADE;");

// Create the correct Users table
$sql_users = "CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);";

// Create your Orders table
$sql_orders = "CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    items JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    notes TEXT,
    receipt_image TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);";

$res1 = pg_query($conn, $sql_users);
$res2 = pg_query($conn, $sql_orders);

if ($res1 && $res2) {
    echo "<h1 style='color: green;'>Tables recreated successfully! Ready to test!</h1>";
} else {
    echo "<h1 style='color: red;'>Error: " . pg_last_error($conn) . "</h1>";
}
pg_close($conn);
?>