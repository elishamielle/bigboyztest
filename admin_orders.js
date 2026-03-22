document.addEventListener('DOMContentLoaded', fetchAdminOrders);

async function fetchAdminOrders() {
    try {
        const response = await fetch('admin_get_orders.php');
        const data = await response.json();

        if (data.status === 'success') {
            const allOrders = data.orders;
            const pending = allOrders.filter(o => o.status.toLowerCase() === 'pending');
            const completed = allOrders.filter(o => o.status.toLowerCase() === 'completed');

            if (document.getElementById('pending_orders_body')) {
                renderOrders(pending, 'pending_orders_body', true);
                document.getElementById('totalPendingCount').innerText = pending.length;
            }
            
            if (document.getElementById('completed_orders_body')) {
                renderOrders(completed, 'completed_orders_body', false);
                document.getElementById('totalCompletedCount').innerText = completed.length;
            }

            if (document.getElementById('dashboard_orders_body')) {
                renderOrders(pending.slice(0, 5), 'dashboard_orders_body', true); 
                calculateSales(completed);
            }
        } else {
            console.error("Failed to load orders", data.message);
        }
    } catch (err) {
        console.error("Fetch error", err);
    }
}

function renderOrders(orders, containerId, isPending) {
    const tbody = document.getElementById(containerId);
    tbody.innerHTML = '';

    if (orders.length === 0) {
        const colCount = isPending ? 7 : 6;
        tbody.innerHTML = `<tr><td colspan="${colCount}" style="text-align:center;">No orders found.</td></tr>`;
        return;
    }

    orders.forEach(order => {
        const dateObj = new Date(order.created_at);
        const timeStr = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const dateStr = dateObj.toLocaleDateString();
        
        let itemsText = order.items.map(i => `${i.name} (${i.qty})`).join(', ');
        let itemsListHtml = order.items.map(i => `<li>${i.qty}x ${i.name} Flavor: ${i.flavor || 'Original'}</li>`).join('');
        
        const badgeClass = isPending ? 'pending' : 'completed';
        const actionBtn = isPending ? `<td><button class="action-btn" onclick="markComplete(${order.id}, event)">MARK COMPLETE</button></td>` : '';

        let receiptPath = "../images/qr.png";
        if (order.receipt_image && order.receipt_image !== "") {
            receiptPath = "../" + order.receipt_image; 
        }

        tbody.innerHTML += `
            <tr class="order-main-row" onclick="toggleDetails('order_${order.id}')">
                <td>#${order.id.toString().padStart(4, '0')}</td>
                ${isPending ? `<td>${timeStr}</td>` : `<td>${timeStr}</td>`}
                <td>${order.customer_name}</td>
                <td>${itemsText}</td>
                <td>P ${parseFloat(order.total).toFixed(2)}</td>
                <td><span class="badge ${badgeClass}">${order.status.toUpperCase()}</span></td>
                ${actionBtn}
            </tr>
            <tr class="order-details-row" id="order_${order.id}">
                <td colspan="${isPending ? 7 : 6}">
                    <div class="expanded-content">
                        <div class="expanded-left">
                            <h4>ORDER DETAILS</h4>
                            <p><strong>Customer Name:</strong> ${order.customer_name}</p>
                            <p><strong>Date and Time:</strong> ${dateStr} at ${timeStr}</p>
                            <p><strong>Notes:</strong> ${order.notes || 'None'}</p>
                            
                            <h4>ITEMS ORDERED:</h4>
                            <ul>${itemsListHtml}</ul>
                        </div>
                        <div class="expanded-right">
                            <h4>PROOF OF PAYMENT</h4>
                            <div class="receipt-box">
                                <img src="${receiptPath}" alt="Receipt" class="proof-img">
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });
}

window.toggleDetails = function(orderId) {
    const detailsRow = document.getElementById(orderId);
    if (detailsRow) {
        detailsRow.classList.toggle('open');
    }
};

window.markComplete = function(orderId, event) {
    event.stopPropagation(); 
    
    customConfirm("Mark order #" + orderId + " as complete?", async function() {
        try {
            const response = await fetch('admin_update_order.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: orderId, status: 'Completed' })
            });
            const data = await response.json();
            if (data.status === 'success') {
                window.alert("Order marked as completed!");
                fetchAdminOrders(); 
            } else {
                window.alert("Error: " + data.message);
            }
        } catch (err) {
            console.error(err);
        }
    });
};

function calculateSales(completedOrders) {
    let today = 0;
    let week = 0;
    let month = 0;
    const now = new Date();

    completedOrders.forEach(order => {
        const safeDateString = order.created_at.replace(' ', 'T');
        const orderDate = new Date(safeDateString);
        const total = parseFloat(order.total) || 0;

        if (orderDate.toDateString() === now.toDateString()) {
            today += total;
        }
        if (orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear()) {
            month += total;
        }
        week += total; 
    });

    const todayEl = document.getElementById('sales_today');
    const weekEl = document.getElementById('sales_week');
    const monthEl = document.getElementById('sales_month');

    if (todayEl) todayEl.innerText = 'P ' + today.toFixed(2);
    if (weekEl) weekEl.innerText = 'P ' + week.toFixed(2);
    if (monthEl) monthEl.innerText = 'P ' + month.toFixed(2);
}