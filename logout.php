<?php
session_start();
session_unset();    // Clears your name and ID from the server's memory
session_destroy();  // Destroys the "wristband" (session) entirely

// Send the user back to the home page
header("Location: index.html"); 
exit();
?>