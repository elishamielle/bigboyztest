function loadMenu() {
    fetch('menu.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('menu-container');
            if (!container) return;  
            
            container.innerHTML = '';  

            // Loop through every item in  menu.json
            for (const key in data) {
                const item = data[key];

                // Clean the price (Turns "P99.00" into 99.00)
                const rawPrice = parseFloat(item.price.replace('P', '').replace(',', ''));

                // Flavor Dropdown (ONLY if the item has flavors)
                let flavorDropdownHTML = '';
                if (item.flavors) {
                    let options = item.flavors.map(flavor => `<option value="${flavor}">${flavor}</option>`).join('');
                    flavorDropdownHTML = `
                        <label style="font-family: 'Barlow Condensed', sans-serif; font-size: 18px;">Flavor:</label>
                        <select class="item-flavor" style="margin-bottom: 10px; width: 100%; padding: 5px;">
                            ${options}
                        </select>
                    `;
                } else {
                    flavorDropdownHTML = `<input type="hidden" class="item-flavor" value="Regular">`;
                }

                //  Card HTML
                const cardHTML = `
                    <div class="menu-item-card" style="border: 1px solid #ddd; padding: 15px; margin: 10px; border-radius: 8px; width: 250px; display: inline-block; vertical-align: top; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        
                        <img src="${item.image}" class="item-image" alt="${item.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px;">
                        
                        <h3 class="item-name" style="font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: #ff5722; margin-top: 10px;">${item.name}</h3>
                        <p style="font-family: 'Barlow Condensed', sans-serif; font-size: 14px; color: #666; height: 80px; overflow-y: auto;">${item.description}</p>
                        
                        <h2 class="item-price" data-price="${rawPrice}" style="font-family: 'Passion One', sans-serif; font-size: 28px;">${item.price}</h2>
                        
                        ${flavorDropdownHTML}

                        <label style="font-family: 'Barlow Condensed', sans-serif; font-size: 18px;">Qty:</label>
                        <input type="number" class="item-qty" value="1" min="1" style="width: 60px; margin-bottom: 15px; padding: 5px;">
                        <br>
                        
                        <button class="add-to-cart-btn" onclick="addToCartDynamic(this)" style="width: 100%; padding: 10px; background-color: #ff5722; color: white; border: none; cursor: pointer; font-family: 'Bebas Neue', sans-serif; font-size: 20px; border-radius: 5px; transition: 0.3s;">
                            ADD TO CART
                        </button>
                    </div>
                `;

                // Adds the card to the page
                container.innerHTML += cardHTML;
            }
        })
        .catch(error => console.error('Error loading menu:', error));
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', loadMenu);