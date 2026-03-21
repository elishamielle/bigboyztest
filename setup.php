<?php
// Get connection info from Render Environment Variables
$host = getenv('DB_HOST');
$db   = getenv('DB_NAME');
$user = getenv('DB_USER');
$pass = getenv('DB_PASSWORD');

$conn_str = "host=$host dbname=$db user=$user password=$pass sslmode=require";
$dbconn = pg_connect($conn_str);

if (!$dbconn) {
    die("<h1>Database Connection Failed!</h1> Check your Render Environment Variables.");
}

// The SQL command to create the users table
$sql = "CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);";

// Run the command
$result = pg_query($dbconn, $sql);

if ($result) {
    echo "<h1 style='color: green;'>Success! The 'users' table has been created! 🎉</h1>";
} else {
    echo "<h1 style='color: red;'>Error creating table: " . pg_last_error($dbconn) . "</h1>";
}

pg_close($dbconn);
?>