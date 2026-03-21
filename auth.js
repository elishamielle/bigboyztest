document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // 1. Fetch session data with a cache-buster
    // ==========================================
    fetch('check_session.php?v=' + new Date().getTime())
    .then(res => res.json())
    .then(data => {
        // Elements for Navbar
        const authLink = document.getElementById('nav-auth-text');
        const userIconLink = document.getElementById('nav-user-link');
        
        // Elements for Profile Page
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');

        if (data.status === "logged_in") {
            // Update Navbar
            if (authLink) {
                authLink.textContent = "HI, " + data.name.toUpperCase();
                authLink.href = "profile.html"; 
            }
            if (userIconLink) userIconLink.href = "profile.html";

            // Update Profile Page specific elements
            if (profileName) {
                profileName.textContent = data.name.toUpperCase();
            }
            if (profileEmail) {
                profileEmail.textContent = data.email;
            }

        } else {
            // If NOT logged in and on the profile page, redirect to login
            if (window.location.pathname.includes("profile.html")) {
                window.location.href = "login.html";
            }
            
            // Set Navbar to default
            if (authLink) {
                authLink.textContent = "Log-in/Sign-up";
                authLink.href = "login.html";
            }
        }
    })
    .catch(err => console.error("Session check failed:", err));

    // ==========================================
    // 2. Handle Logout button (Shared logic)
    // ==========================================
    const logoutBtn = document.querySelector('.profile-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const confirmLogout = confirm("Are you sure you want to log out of Big Boyz Diner?");
            if (confirmLogout) {
                window.location.href = 'logout.php';
            }
        });
    }
});