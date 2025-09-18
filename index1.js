document.addEventListener('DOMContentLoaded', function() {
    // Function to get products from localStorage
    function getProducts() {
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    }

    // Function to save products to localStorage
    function saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Initialize with sample products if localStorage is empty
    function initializeProducts() {
        if (getProducts().length === 0) {
            const sampleProducts = [
                { id: 1, name: "Wireless Headphones", category: "Electronics", price: 89.99, stock: 25, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
                { id: 2, name: "Running Shoes", category: "Clothing", price: 69.99, stock: 40, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
                { id: 3, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 15, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1999&q=80" },
                { id: 4, name: "Coffee Maker", category: "Home & Kitchen", price: 49.99, stock: 30, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" }
            ];
            saveProducts(sampleProducts);
        }
        return getProducts();
    }

    // Get products from localStorage
    let products = initializeProducts();
    
    // DOM Elements
    const adminSection = document.getElementById('adminSection');
    const adminLink = document.getElementById('adminLink');
    const adminTabs = document.querySelectorAll('.admin-tab');
    const tabContents = document.querySelectorAll('.admin-tab-content');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductModal = document.getElementById('addProductModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const productForm = document.getElementById('productForm');
    const adminProductsTable = document.getElementById('adminProductsTable');
    const productGrid = document.getElementById('productGrid');
    const notification = document.getElementById('notification');
    
    // Initialize the products table and grid
    renderProductsTable();
    renderProductGrid();
    
    // Admin link functionality
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            adminSection.classList.toggle('active');
            
            if (adminSection.classList.contains('active')) {
                window.scrollTo({
                    top: adminSection.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Tab switching functionality
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            adminTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = `${tab.dataset.tab}Tab`;
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Modal functionality
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            addProductModal.classList.add('active');
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside the modal content
    if (addProductModal) {
        addProductModal.addEventListener('click', (e) => {
            if (e.target === addProductModal) {
                closeModal();
            }
        });
    }
    
    // Form submission
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('productName').value;
            const category = document.getElementById('productCategory').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const stock = parseInt(document.getElementById('productStock').value);
            const description = document.getElementById('productDescription').value;
            const image = document.getElementById('productImage').value;
            
            // Generate a unique ID
            const newId = Date.now() + Math.floor(Math.random() * 1000);
            
            // Create new product object
            const newProduct = {
                id: newId,
                name,
                category,
                price,
                stock,
                description,
                image
            };
            
            // Get current products from localStorage
            const currentProducts = getProducts();
            
            // Add new product
            currentProducts.push(newProduct);
            
            // Save updated products to localStorage
            saveProducts(currentProducts);
            
            // Update the table and grid
            renderProductsTable();
            renderProductGrid();
            
            // Show success notification
            showNotification('Product added successfully!', 'success');
            
            // Close modal and reset form
            closeModal();
            productForm.reset();
        });
    }
    
    // Function to render products table
    function renderProductsTable() {
        if (!adminProductsTable) return;
        
        adminProductsTable.innerHTML = '';
        
        const currentProducts = getProducts();
        
        currentProducts.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td class="action-buttons">
                    <button class="btn btn-primary">Edit</button>
                    <button class="btn btn-danger" data-id="${product.id}">Delete</button>
                </td>
            `;
            
            adminProductsTable.appendChild(row);
        });
        
        // Add event listeners to delete buttons
        const deleteButtons = adminProductsTable.querySelectorAll('.btn-danger');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = parseInt(button.getAttribute('data-id'));
                deleteProduct(productId);
            });
        });
    }
    
    // Function to delete a product
    function deleteProduct(productId) {
        const currentProducts = getProducts();
        const updatedProducts = currentProducts.filter(product => product.id !== productId);
        
        // Save updated products to localStorage
        saveProducts(updatedProducts);
        
        // Re-render the table and grid
        renderProductsTable();
        renderProductGrid();
        
        // Show notification
        showNotification('Product deleted successfully!', 'success');
    }
    
    // Function to render product grid
    function renderProductGrid() {
        if (!productGrid) return;
        
        productGrid.innerHTML = '';
        
        const currentProducts = getProducts();
        
        currentProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;
            
            productCard.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart-btn">Add to Cart</button>
                        <button class="btn btn-success">Buy Now</button>
                    </div>
                </div>
            `;
            
            productGrid.appendChild(productCard);
        });
        
        // Add cart functionality to the newly created buttons
        addCartFunctionalityToProducts();
    }
    
    // Function to close modal
    function closeModal() {
        if (addProductModal) {
            addProductModal.classList.remove('active');
        }
    }
    
    // Function to show notification
    function showNotification(message, type) {
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = 'notification';
        notification.classList.add(type);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove(type);
        }, 3000);
    }

    // ================= SHOPPING CART FUNCTIONALITY =================
    
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // DOM Elements for cart
    const cartButton = document.getElementById('cartButton');
    const cartModal = document.getElementById('cartModal');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountElement = document.querySelector('.cart-count');
    const cartSubtotalElement = document.getElementById('cartSubtotal');
    const cartShippingElement = document.getElementById('cartShipping');
    const cartTaxElement = document.getElementById('cartTax');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutButton = document.querySelector('.btn-checkout');
    
    // Initialize cart
    updateCartCount();
    
    // Event Listeners for cart
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            cartModal.style.display = 'block';
            updateCartDisplay();
        });
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            showNotification('Proceeding to checkout...', 'success');
            
            // For demo purposes, clear cart after delay
            setTimeout(() => {
                cart = [];
                saveCartToStorage();
                updateCartDisplay();
                updateCartCount();
                cartModal.style.display = 'none';
                showNotification('Order placed successfully!', 'success');
            }, 2000);
        });
    }
    
    // Add to Cart Function
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        updateCartCount();
        saveCartToStorage();
        showNotification(`${product.name} added to cart!`, 'success');
    }
    
    // Update Cart Count
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }
    
    // Update Cart Display
    function updateCartDisplay() {
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            <button class="cart-item-remove" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
        
        updateCartSummary();
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                updateQuantity(this.dataset.id, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                updateQuantity(this.dataset.id, 1);
            });
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                removeFromCart(this.dataset.id);
            });
        });
    }
    
    // Update Quantity
    function updateQuantity(productId, change) {
        const item = cart.find(item => item.id == productId);
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                cart = cart.filter(item => item.id != productId);
            }
            
            updateCartCount();
            updateCartDisplay();
            saveCartToStorage();
        }
    }
    
    // Remove from Cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id != productId);
        updateCartCount();
        updateCartDisplay();
        saveCartToStorage();
        showNotification('Item removed from cart', 'success');
    }
    
    // Update Cart Summary
    function updateCartSummary() {
        if (!cartSubtotalElement) return;
        
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 0 ? 5.99 : 0;
        const tax = subtotal * 0.1; // 10% tax
        
        cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        cartShippingElement.textContent = `$${shipping.toFixed(2)}`;
        cartTaxElement.textContent = `$${tax.toFixed(2)}`;
        cartTotalElement.textContent = `$${(subtotal + shipping + tax).toFixed(2)}`;
    }
    
    // Save Cart to Local Storage
    function saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Add event listeners to all "Add to Cart" buttons
    function addCartFunctionalityToProducts() {
        document.addEventListener('click', function(e) {
            const addToCartBtn = e.target.closest('.add-to-cart-btn');
            
            if (addToCartBtn) {
                e.preventDefault();
                
                // Get the product details
                const productCard = addToCartBtn.closest('.product-card');
                if (productCard) {
                    const productId = parseInt(productCard.dataset.id);
                    const productName = productCard.querySelector('.product-title')?.textContent || 'Product';
                    const productPriceText = productCard.querySelector('.product-price')?.textContent || '0';
                    const productPrice = parseFloat(productPriceText.replace('$', '')) || 0;
                    const productImage = productCard.querySelector('img')?.src || '';
                    
                    const product = {
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage
                    };
                    
                    addToCart(product);
                }
            }
        });
    }
    
    // Initialize cart functionality
    addCartFunctionalityToProducts();
});

// ================= SHOPPING CART FUNCTIONALITY =================

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements for cart
const cartButton = document.getElementById('cartButton');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountElement = document.querySelector('.cart-count');
const cartSubtotalElement = document.getElementById('cartSubtotal');
const cartShippingElement = document.getElementById('cartShipping');
const cartTaxElement = document.getElementById('cartTax');
const cartTotalElement = document.getElementById('cartTotal');
const checkoutButton = document.querySelector('.btn-checkout');

// Initialize cart
updateCartCount();

// Event Listeners for cart
if (cartButton) {
    cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.style.display = 'block';
        updateCartDisplay();
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
}

window.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

if (checkoutButton) {
    checkoutButton.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        
        showNotification('Proceeding to checkout...', 'success');
        
        // For demo purposes, clear cart after delay
        setTimeout(() => {
            cart = [];
            saveCartToStorage();
            updateCartDisplay();
            updateCartCount();
            cartModal.style.display = 'none';
            showNotification('Order placed successfully!', 'success');
        }, 2000);
    });
}

// Add to Cart Function
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    saveCartToStorage();
    showNotification(`${product.name} added to cart!`, 'success');
}

// Update Cart Count
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Update Cart Display
function updateCartDisplay() {
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <button class="cart-item-remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    
    updateCartSummary();
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            updateQuantity(this.dataset.id, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            updateQuantity(this.dataset.id, 1);
        });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            removeFromCart(this.dataset.id);
        });
    });
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id == productId);
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id != productId);
        }
        
        updateCartCount();
        updateCartDisplay();
        saveCartToStorage();
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage();
    showNotification('Item removed from cart', 'success');
}

// Update Cart Summary
function updateCartSummary() {
    if (!cartSubtotalElement) return;
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5.99 : 0;
    const tax = subtotal * 0.1; // 10% tax
    
    cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    cartShippingElement.textContent = `$${shipping.toFixed(2)}`;
    cartTaxElement.textContent = `$${tax.toFixed(2)}`;
    cartTotalElement.textContent = `$${(subtotal + shipping + tax).toFixed(2)}`;
}

// Save Cart to Local Storage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add event listeners to all "Add to Cart" buttons
function addCartFunctionalityToProducts() {
    document.addEventListener('click', function(e) {
        const addToCartBtn = e.target.closest('.add-to-cart-btn');
        
        if (addToCartBtn) {
            e.preventDefault();
            
            // Get the product details
            const productCard = addToCartBtn.closest('.product-card');
            if (productCard) {
                const productId = parseInt(productCard.dataset.id);
                const productName = productCard.querySelector('.product-title')?.textContent || 'Product';
                const productPriceText = productCard.querySelector('.product-price')?.textContent || '0';
                const productPrice = parseFloat(productPriceText.replace('$', '')) || 0;
                const productImage = productCard.querySelector('img')?.src || '';
                
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                };
                
                addToCart(product);
            }
        }
    });
}

// Initialize cart functionality
addCartFunctionalityToProducts();