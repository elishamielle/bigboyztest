<?php
$host = getenv('DB_HOST');
$db   = getenv('DB_NAME');
$user = getenv('DB_USER');
$pass = getenv('DB_PASSWORD');

$conn_str = "host=$host dbname=$db user=$user password=$pass sslmode=require";
$conn = pg_connect($conn_str);
date_default_timezone_set('Asia/Manila');
pg_query($conn, "SET TIME ZONE 'Asia/Manila';");

if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Database connection failed!"]));
}