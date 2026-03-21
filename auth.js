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
                authLink.textContent = data.name.toUpperCase();
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
            // Inside your auth.js fetch('check_session.php') logic:
            if (document.getElementById('orders-table-body')) {
                fetch('get_orders.php')
                .then(res => res.json())
                .then(orders => {
                    const tableBody = document.getElementById('orders-table-body');
                    tableBody.innerHTML = '';
                    orders.forEach(order => {
                        tableBody.innerHTML += `
                            <tr>
                                <td>#${order.id}</td>
                                <td>${order.created_at}</td>
                                <td>P ${parseFloat(order.total).toFixed(2)}</td>
                                <td><span class="status-${order.status.toLowerCase()}">${order.status}</span></td>
                            </tr>
                        `;
                    });
                });
            }

        } else {
            // 🟢 THE FIX: If they are not logged in, ensure the cart is totally empty!
            localStorage.removeItem('bigboyz_cart');

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
                // 🟢 THE FIX: Wipe the cart from the browser memory!
                localStorage.removeItem('bigboyz_cart'); 
                
                window.location.href = 'logout.php';
            }
        });
    }
});