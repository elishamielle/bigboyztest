// 1. Storage for the data
let globalOrders = [];

// 2. THE TRIGGER
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded, calling fetchOrders...");
    fetchOrders();
});

// 🟢 MOVE THIS FUNCTION TO THE TOP (Best practice for "clickable" functions)
function toggleOrderDetails(index) {
    const pane = document.getElementById(`details-${index}`);
    if (pane) {
        pane.style.display = (pane.style.display === "none") ? "block" : "none";
    }
}

async function fetchOrders() {
    const container = document.querySelector('.cart-items');
    try {
        const response = await fetch('get_orders.php');
        const data = await response.json();

        if (data.status === 'success') {
            globalOrders = data.orders;
            
            if (globalOrders.length === 0) {
                container.innerHTML = '<h2 style="text-align:center; color:#888;">No orders found yet. Time to eat!</h2>';
                return;
            }

            container.innerHTML = '';
            
            globalOrders.forEach((order, index) => {
                const itemNames = (order.items && order.items.length > 0) 
                    ? order.items.map(i => i.name).join(', ') 
                    : 'Items not found';
                const statusClass = order.status ? order.status.toLowerCase() : 'pending';
                
                // 🟢 SAFE IMAGE VARIABLE
                const firstItemImage = (order.items && order.items.length > 0 && order.items[0].image) 
                    ? order.items[0].image 
                    : 'images/imgPlaceholder.jpg';

                container.innerHTML += `
                    <div class="cart-row clickable" onclick="toggleOrderDetails(${index})" style="display: flex; flex-direction: column; align-items: stretch; margin-bottom: 20px; cursor: pointer;">
                        
                        <div class="order-header-wrapper" style="display: flex; justify-content: space-between; align-items: center; gap: 20px; width: 100%; pointer-events: none;">
                            
                            <div class="cart-item-card" style="flex: 1; margin-bottom: 0;">
                                <div class="cart-item-left">
                                    <img src="${firstItemImage}" class="cart-item-img" alt="Order Image">
                                    <div class="cart-item-details">
                                        <h3 class="cart-item-title">${itemNames}</h3>
                                        <span class="order-date">${new Date(order.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div class="cart-item-right">
                                    <span class="cart-item-total-label">TOTAL</span>
                                    <span class="cart-item-price">P ${parseFloat(order.total).toFixed(2)}</span>
                                </div>
                            </div>

                            <div class="order-status-block" style="margin-top: 0; min-width: 100px; text-align: center;">
                                <span class="status-label" style="display: block; margin-bottom: 5px;">STATUS</span>
                                <span class="status-badge ${statusClass}">${(order.status || 'Pending').toUpperCase()}</span>
                            </div>
                        </div>

                        <div id="details-${index}" class="order-details-pane" style="display: none; width: 100%; border-top: 1px dashed #ccc; margin-top: 10px; padding-top: 10px; pointer-events: auto;">
                            <h4 style="margin-bottom:10px; color:#EF5225;">ITEMS ORDERED:</h4>
                            ${(order.items || []).map(item => `
                                <div class="detail-line" style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span>${item.name} x${item.qty} (${item.flavor || 'Original'})</span>
                                    <span>P ${(parseFloat(item.price) * item.qty).toFixed(2)}</span>
                                </div>
                            `).join('')}
                            <div class="detail-notes" style="margin-top: 10px; padding: 10px; background: #f9f9f9; border-left: 3px solid #EF5225;">
                                <strong>Notes:</strong> ${order.notes || 'No special instructions.'}
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
             container.innerHTML = '<h2 style="text-align:center; color:#888;">Error loading orders.</h2>';
        }
    } catch (e) { 
        console.error("Orders JS Error:", e); 
        container.innerHTML = '<h2 style="text-align:center; color:red;">Failed to connect to server.</h2>';
    }
}