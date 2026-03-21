<?php
require 'db.php';

echo "<h2>Orders in Database:</h2>";
$result = pg_query($conn, "SELECT * FROM orders");

if (pg_num_rows($result) > 0) {
    echo "<table border='1'><tr><th>ID</th><th>User ID</th><th>Total</th><th>Status</th></tr>";
    while ($row = pg_fetch_assoc($result)) {
        echo "<tr><td>{$row['id']}</td><td>{$row['user_id']}</td><td>{$row['total']}</td><td>{$row['status']}</td></tr>";
    }
    echo "</table>";
} else {
    echo "No orders found in the database.";
}

pg_close($conn);
?>