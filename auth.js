document.addEventListener('DOMContentLoaded', function() {
    // Fetch session data with a cache-buster
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
            if (authLink) {
                authLink.textContent = data.name.toUpperCase();
                authLink.href = "profile.html"; 
            }
            if (userIconLink) userIconLink.href = "profile.html";

            if (profileName) {
                profileName.textContent = data.name.toUpperCase();
            }
            if (profileEmail) {
                profileEmail.textContent = data.email;
            }

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
            // ensures the cart is empty
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

    // Handle Logout button (Shared logic)
    const logoutBtn = document.querySelector('.profile-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            customConfirm("Are you sure you want to log out of Big Boyz Diner?", function() {
                localStorage.removeItem('bigboyz_cart'); 
                window.location.href = 'logout.php';
            });
        });
    }
});