// product-detail.js

document.addEventListener("click", function(e) {
    // 1. HANDLE FLAVOR BUTTON CLICKS
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
        } else if (e.target.textContent === '-' && currentQty > 0) { // Allows going back down to 0
            currentQty--;
        }
        qtyDisplay.textContent = currentQty;
    }

    // 3. MASTER ADD TO CART LOGIC (FIXED CLICK TARGET!)
    const addCartBtn = e.target.closest('.add-cart-btn');
    
    if (addCartBtn) {
        // --- RULE 1: FORCES MANUAL FLAVOR SELECTION ---
        const allSelected = document.querySelectorAll('.flavor-btn.selected');
        let selectedFlavorBtn = null;

        allSelected.forEach(btn => {
            if (btn.offsetParent !== null) {
                selectedFlavorBtn = btn;
            }
        });
        
        if (!selectedFlavorBtn) {
            alert("Please choose a flavor first!");
            return; // Stops the code dead in its tracks
        }

        // --- RULE 2: FORCES MANUAL QUANTITY SELECTION ---
        const qtyDisplayEl = document.querySelector('.qty-num');
        const currentQty = qtyDisplayEl ? parseInt(qtyDisplayEl.textContent) : 0;

        if (isNaN(currentQty) || currentQty === 0) {
            alert("Please select a quantity of at least 1!");
            return; // Stops the code dead in its tracks
        }

        // --- If they followed the rules, check login and save! ---
        fetch('check_session.php')
            .then(res => res.json())
            .then(userData => {
                if (userData.status !== "logged_in") {
                    sessionStorage.setItem('bb_pending_toast', 'Please log in to add items to your cart!');
                    window.location.href = "login.html";
                    return;
                }

                try {
                    const itemName = document.getElementById('dish-title').textContent;
                    const itemPriceText = document.getElementById('dish-price').textContent;
                    const itemImgSrc = document.getElementById('dish-image').src;
                    const itemFlavor = selectedFlavorBtn.textContent;
                    
                    // Clean price string
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
                    
                    // Reset UI back to 0 and unselect flavor for the next item
                    if(qtyDisplayEl) qtyDisplayEl.textContent = "0"; 
                    selectedFlavorBtn.classList.remove('selected');
                    selectedFlavorBtn.style.backgroundColor = "";
                    selectedFlavorBtn.style.color = "";

                } catch (error) {
                    console.error("Failed to read dish details from HTML:", error);
                    alert("Error adding item. Please check the console.");
                }
            })
            .catch(err => console.error("Session check failed:", err));
    }
});