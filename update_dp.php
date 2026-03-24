<?php
require 'db.php';
$sql = "ALTER TABLE orders ADD COLUMN completed_at TIMESTAMP;";
$result = pg_query($conn, $sql);
if ($result) {
    echo "<h1 style='color: green;'>Successfully added completed_at column!</h1>";
} else {
    echo "<h1 style='color: red;'>Error updating database.</h1>";
}
pg_close($conn);
?>