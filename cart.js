// cart.js

// 1. DYNAMIC ADD TO CART FUNCTION
// cart.js

async function addToCartDynamic(clickedButton) {
    const authText = document.getElementById('nav-auth-text');
    if (!authText || authText.textContent.includes("Log-in")) {
        sessionStorage.setItem('bb_pending_toast', 'Please sign in to add items to your cart!');
        window.location.href = "login.html";
        return;
    }
    try {
        const response = await fetch('check_session.php');
        const data = await response.json();

        if (data.status !== 'logged_in') {
            sessionStorage.setItem('bb_pending_toast', 'Sign-in first to add to cart!');
            window.location.href = "login.html";
            return; 
        }

        // 1. Find the Card
        const card = clickedButton.closest('.menu-item-card');
        
        // 2. Extract Data
        const itemName = card.querySelector('.item-name').innerText;
        const itemImage = card.querySelector('.item-image').getAttribute('src');
        
        // 🟢 THE FIX: Reading the attribute directly
        const priceAttr = card.querySelector('.item-price').getAttribute('data-price');
        const itemPrice = parseFloat(priceAttr);
        
        const flavorElement = card.querySelector('.item-flavor');
        const itemFlavor = flavorElement ? flavorElement.value : 'Regular';
        
        const qtyElement = card.querySelector('.item-qty');
        const itemQty = qtyElement ? parseInt(qtyElement.value) : 1;

        // 🔍 EMERGENCY DEBUGGING: 
        // This will show up in your F12 Console. Tell me what it says!
        console.log("--- ATTEMPTING TO ADD ---");
        console.log("Name:", itemName);
        console.log("Price raw attribute:", priceAttr);
        console.log("Price parsed:", itemPrice);
        console.log("Qty:", itemQty);
        console.log("Flavor:", itemFlavor);

        if (isNaN(itemPrice)) {
            alert("Error: Price not found on card. Check loadMenu.js classes!");
            return;
        }

        let cart = JSON.parse(localStorage.getItem('bigboyz_cart')) || [];
        let existingItem = cart.find(item => item.name === itemName && item.flavor === itemFlavor);
        
        if (existingItem) {
            existingItem.qty += itemQty;
        } else {
            cart.push({ 
                name: itemName, 
                price: itemPrice, 
                image: itemImage, 
                flavor: itemFlavor, 
                qty: itemQty 
            });
        }

        localStorage.setItem('bigboyz_cart', JSON.stringify(cart));
        alert(`${itemQty}x ${itemName} added to cart!`);

    } catch (error) {
        console.error("Cart error:", error);
    }
}

// 2. RENDER CART FUNCTION
function renderCart() {
    const container = document.getElementById('cart-items-container');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const summarySection = document.getElementById('cart-summary-section');
    const totalPriceEl = document.getElementById('cart-total-price');

    if (!container) return;

    let cart = JSON.parse(localStorage.getItem('bigboyz_cart')) || [];
    let grandTotal = 0;

    if (cart.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
        container.innerHTML = '';
        if (summarySection) summarySection.style.display = 'none';
        return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    if (summarySection) summarySection.style.display = 'flex';
    container.innerHTML = '';

    cart.forEach((item, index) => {
        // 🟢 Ensure item.price is treated as a number
        let priceNum = parseFloat(item.price) || 0;
        let itemTotal = priceNum * item.qty;
        grandTotal += itemTotal;

        container.innerHTML += `
            <div class="cart-row">
                <div class="cart-item-card">
                    <div class="cart-item-left">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h3 class="cart-item-title">${item.name}</h3>
                            <div class="cart-item-controls">
                                <span class="cart-qty-label">QTY</span>
                                <button class="cart-qty-btn" onclick="updateQty(${index}, -1)">-</button>
                                <span class="cart-qty-num">${item.qty}</span>
                                <button class="cart-qty-btn" onclick="updateQty(${index}, 1)">+</button>
                                <span class="cart-flavor-tag">${item.flavor}</span>
                            </div>
                        </div>
                    </div>
                    <div class="cart-item-right">
                        <span class="cart-item-total-label">TOTAL</span>
                        <span class="cart-item-price">P ${itemTotal.toFixed(2)}</span>
                    </div>
                </div>
                <button class="cart-delete-btn" onclick="removeItem(${index})">
                    <img src="images/trash.png" alt="Remove">
                </button>
            </div>
        `;
    });

    if (totalPriceEl) totalPriceEl.innerText = 'P ' + grandTotal.toFixed(2);
}

// 3. CART CONTROLS
function updateQty(index, changeAmount) {
    let cart = JSON.parse(localStorage.getItem('bigboyz_cart'));
    cart[index].qty += changeAmount;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    localStorage.setItem('bigboyz_cart', JSON.stringify(cart));
    renderCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('bigboyz_cart'));
    cart.splice(index, 1);
    localStorage.setItem('bigboyz_cart', JSON.stringify(cart));
    renderCart();
}

// Add this to the bottom of cart.js
function goToCheckoutPage() {
    let cart = JSON.parse(localStorage.getItem('bigboyz_cart')) || [];
    
    // Check if there is actually food in the cart
    if (cart.length === 0) {
        alert("Your cart is empty! Let's get some Big Boyz meals first.");
        return;
    }

    // Move to the review/checkout page
    window.location.href = "checkout.html";
}

document.addEventListener('DOMContentLoaded', renderCart);