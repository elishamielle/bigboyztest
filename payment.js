// ==========================================
// 1. PAGE INITIALIZER (Runs on Load)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Check if we are on checkout.html (Review Page)
    if (document.getElementById('checkout-items-display')) {
        renderCheckoutItems();
    }
    
    // Check if we are on payment.html (QR/Upload Page)
    if (document.getElementById('payment-final-total')) {
        renderPaymentTotal();
        setupReceiptPreview(); // Start listening for the image upload
    }
});

// ==========================================
// 2. REVIEW PAGE FUNCTIONS (checkout.html)
// ==========================================
function renderCheckoutItems() {
    const container = document.getElementById('checkout-items-display');
    const totalEl = document.getElementById('checkout-total-price');
    let cart = JSON.parse(localStorage.getItem('bigboyz_cart')) || [];
    let grandTotal = 0;

    container.innerHTML = '';
    cart.forEach(item => {
        let itemTotal = parseFloat(item.price) * parseInt(item.qty);
        grandTotal += itemTotal;
        container.innerHTML += `
            <div class="cart-row">
                <div class="cart-item-card">
                    <div class="cart-item-left">
                        <img src="${item.image}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h3 class="cart-item-title">${item.name}</h3>
                            <div class="cart-item-controls">
                                <span class="cart-qty-num">QTY: ${item.qty}</span>
                                <span class="cart-flavor-tag">${item.flavor}</span>
                            </div>
                        </div>
                    </div>
                    <div class="cart-item-right">
                        <span class="cart-item-price">P ${itemTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>`;
    });
    if (totalEl) totalEl.innerText = 'P ' + grandTotal.toFixed(2);
}

function proceedToPayment() {
    const notesEl = document.getElementById('order-notes');
    const notes = notesEl ? notesEl.value : ""; 
    
    // 🟢 Debugging: This will show in the F12 Console
    console.log("Capturing notes:", notes);
    
    sessionStorage.setItem('temp_order_notes', notes);
    
    // Give the browser a split second to ensure storage is saved
    setTimeout(() => {
        window.location.href = "payment.html";
    }, 100);
}

// ==========================================
// 3. PAYMENT PAGE FUNCTIONS (payment.html)
// ==========================================
function renderPaymentTotal() {
    let cart = JSON.parse(localStorage.getItem('bigboyz_cart')) || [];
    let grandTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalDisplay = document.getElementById('payment-final-total');
    if (totalDisplay) totalDisplay.innerText = 'P ' + grandTotal.toFixed(2);
}

function setupReceiptPreview() {
    const fileInput = document.getElementById('receipt-upload');
    const previewContainer = document.getElementById('receipt-preview-container');
    const previewImg = document.getElementById('receipt-preview-img');

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.setAttribute('src', e.target.result);
                    previewContainer.style.display = 'block';
                }
                reader.readAsDataURL(file);
            }
        });
    }
}

async function finishOrder() {
    const receiptInput = document.getElementById('receipt-upload');
    const receiptFile = receiptInput.files[0];

    if (!receiptFile) {
        alert("Please upload your payment receipt first!");
        return;
    }

    let cart = JSON.parse(localStorage.getItem('bigboyz_cart')) || [];
    let notes = sessionStorage.getItem('temp_order_notes') || "";
    let grandTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0);

    const formData = new FormData();
    formData.append('receipt', receiptFile);
    formData.append('items', JSON.stringify(cart));
    formData.append('total', grandTotal.toFixed(2));
    formData.append('notes', notes);

    try {
        const response = await fetch('checkout.php', {
            method: 'POST',
            body: formData 
        });

        const result = await response.json();
        // Inside finishOrder() in payment.js
        if (result.status === 'success') {
            alert("Salamat! Order placed successfully.");
            localStorage.removeItem('bigboyz_cart');
            window.location.href = "orders.html"; // 🟢 Direct them straight to their history
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Upload Error:", error);
        alert("Connection error. Check XAMPP.");
    }
}