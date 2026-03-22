<?php
require 'db.php';

$admin_email = 'devAdminTEST@gmail.com'; 

$sql = "UPDATE users SET role = 'admin' WHERE email = $1";
$result = pg_query_params($conn, $sql, array($admin_email));

if ($result) {
    echo "<h1 style='color: green;'>Successfully updated " . htmlspecialchars($admin_email) . " to admin!</h1>";
} else {
    echo "<h1 style='color: red;'>Error updating database.</h1>";
}
pg_close($conn);
?>