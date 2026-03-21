// product-detail.js

document.addEventListener("click", function(e) {
    // 1. HANDLE FLAVOR BUTTON CLICKS (Even those from JSON)
    if (e.target.classList.contains('flavor-btn')) {
        const allFlavorBtns = document.querySelectorAll('.flavor-btn');
        allFlavorBtns.forEach(btn => {
            btn.classList.remove('selected');
            btn.style.backgroundColor = ""; 
            btn.style.color = "";
        });

        e.target.classList.add('selected');
        e.target.style.backgroundColor = "#ff5722"; // Big Boyz Orange
        e.target.style.color = "white";
    }

    // 2. HANDLE QUANTITY BUTTONS
    const qtyDisplay = document.querySelector('.qty-num');
    if (e.target.classList.contains('qty-btn')) {
        let currentQty = parseInt(qtyDisplay.textContent);
        if (e.target.textContent === '+') {
            currentQty++;
        } else if (e.target.textContent === '-' && currentQty > 1) {
            currentQty--;
        }
        qtyDisplay.textContent = currentQty;
    }

    // 3. MASTER ADD TO CART LOGIC
    if (e.target.classList.contains('add-cart-btn')) {
        
        // --- RULE 1: CHECK FOR VISIBLE FLAVOR ---
        const allSelected = document.querySelectorAll('.flavor-btn.selected');
        let selectedFlavorBtn = null;

        allSelected.forEach(btn => {
            if (btn.offsetParent !== null) {
                selectedFlavorBtn = btn;
            }
        });
        
        if (!selectedFlavorBtn) {
            alert("Please choose a flavor or option first!");
            return; 
        }

        // --- RULE 2: CHECK FOR QUANTITY (New!) ---
        const qtyDisplay = document.querySelector('.qty-num');
        const currentQty = parseInt(qtyDisplay.textContent);

        if (isNaN(currentQty) || currentQty <= 0) {
            alert("Please select a quantity of at least 1!");
            return; // 🛑 Stops the code if QTY is 0 or broken
        }

        // --- If both rules pass, proceed to Login Check & Save ---
        fetch('check_session.php')
            .then(res => res.json())
            .then(userData => {
                if (userData.status !== "logged_in") {
                    alert("Please log in to add items to your cart!");
                    window.location.href = "login.html";
                    return;
                }

                const itemName = document.getElementById('dish-title').textContent;
                const itemPriceText = document.getElementById('dish-price').textContent;
                const itemImgSrc = document.getElementById('dish-image').src;
                const itemFlavor = selectedFlavorBtn.textContent;
                const itemPrice = parseFloat(itemPriceText.replace(/[^\d.-]/g, ''));

                let cart = JSON.parse(localStorage.getItem('bigboyz_cart')) || [];
                let existingItem = cart.find(item => item.name === itemName && item.flavor === itemFlavor);
                
                if (existingItem) {
                    existingItem.qty += currentQty; 
                } else {
                    cart.push({
                        name: itemName, price: itemPrice, qty: currentQty,
                        image: itemImgSrc, flavor: itemFlavor
                    });
                }
                
                localStorage.setItem('bigboyz_cart', JSON.stringify(cart));
                alert(`${currentQty}x ${itemName} (${itemFlavor}) added to cart!`);
                
                // Reset UI for the next add
                qtyDisplay.textContent = "1"; 
            });
    }
});