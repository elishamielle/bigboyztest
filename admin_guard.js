// admin_guard.js - Protects the Admin folder from non-admins
(function() {
    fetch('check_session.php?v=' + new Date().getTime())
    .then(res => res.json())
    .then(data => {
        if (data.status === "logged_in" && data.role === "admin") {
            document.body.style.display = "block";
        } else {
            // if not admin, redirect to login page
            window.location.href = "login.html";
        }
    })
    .catch(err => {
        window.location.href = "login.html";
    });
})();