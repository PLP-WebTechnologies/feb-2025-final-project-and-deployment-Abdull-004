// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navMenu = document.querySelector('nav ul');
const cartCount = document.getElementById('cart-count');
const featuredProductsContainer = document.getElementById('featured-products');
const allProductsContainer = document.getElementById('all-products');
const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const totalElement = document.getElementById('total');
const checkoutBtn = document.querySelector('.checkout-btn');
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const newsletterForm = document.getElementById('newsletter-form');
const contactForm = document.getElementById('contactForm');

// Products Data
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        category: 'electronics',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'High-quality wireless headphones with noise cancellation'
    },
    {
        id: 2,
        name: 'Smart Watch',
        category: 'electronics',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Latest smart watch with fitness tracking and notifications'
    },
    {
        id: 3,
        name: 'Cotton T-Shirt',
        category: 'clothing',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Comfortable cotton t-shirt available in multiple colors'
    },
    {
        id: 4,
        name: 'Denim Jeans',
        category: 'clothing',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Classic denim jeans with modern fit'
    },
    {
        id: 5,
        name: 'Coffee Maker',
        category: 'home',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Automatic coffee maker for your perfect morning brew'
    },
    {
        id: 6,
        name: 'Indoor Plant',
        category: 'home',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Beautiful indoor plant to freshen up your space'
    },
    {
        id: 7,
        name: 'Bluetooth Speaker',
        category: 'electronics',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Portable bluetooth speaker with great sound quality'
    },
    {
        id: 8,
        name: 'Running Shoes',
        category: 'clothing',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Comfortable running shoes for your workouts'
    }
];

// Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Load products based on current page
    if (featuredProductsContainer) {
        loadFeaturedProducts();
    }

    if (allProductsContainer) {
        loadAllProducts();
        // Add event listeners for filtering and sorting
        categoryFilter.addEventListener('change', filterProducts);
        sortBy.addEventListener('change', sortProducts);
    }

    if (cartItemsContainer) {
        loadCartItems();
    }

    // Update cart count
    updateCartCount();

    // Newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

// Toggle mobile menu
function toggleMobileMenu() {
    navMenu.classList.toggle('show');
}

// Load featured products (first 4 products)
function loadFeaturedProducts() {
    const featuredProducts = products.slice(0, 4);
    featuredProductsContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    addAddToCartListeners();
}

// Load all products
function loadAllProducts() {
    allProductsContainer.innerHTML = products.map(product => createProductCard(product)).join('');
    addAddToCartListeners();
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Add event listeners to "Add to Cart" buttons
function addAddToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add product to cart
function addToCart(e) {
    const productId = parseInt(e.target.closest('.add-to-cart').getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showToast(`${product.name} added to cart`);
    
    // If on cart page, refresh cart items
    if (cartItemsContainer) {
        loadCartItems();
    }
}

// Update cart count in header
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Load cart items
function loadCartItems() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => createCartItem(item)).join('');
        checkoutBtn.disabled = false;
        addCartItemListeners();
    }
    
    updateCartTotals();
}

// Create cart item HTML
function createCartItem(item) {
    return `
        <div class="cart-item" data-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
                <div class="item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="item-total">
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
}

// Add event listeners to cart items (quantity buttons and remove)
function addCartItemListeners() {
    const decreaseButtons = document.querySelectorAll('.decrease');
    const increaseButtons = document.querySelectorAll('.increase');
    const removeButtons = document.querySelectorAll('.remove-item');
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Decrease item quantity
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
}

// Increase item quantity
function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    item.quantity += 1;
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
}

// Remove item from cart
function removeItem(e) {
    const productId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
    
    // Show success message
    const product = products.find(p => p.id === productId);
    showToast(`${product.name} removed from cart`);
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5 : 0;
    const total = subtotal + shipping;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    shippingElement.textContent = `$${shipping.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Filter products by category
function filterProducts() {
    const category = categoryFilter.value;
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    allProductsContainer.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    addAddToCartListeners();
}

// Sort products
function sortProducts() {
    const sortValue = sortBy.value;
    let sortedProducts = [...products];
    
    switch (sortValue) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            // Default sorting (original order)
            break;
    }
    
    allProductsContainer.innerHTML = sortedProducts.map(product => createProductCard(product)).join('');
    addAddToCartListeners();
}

// Handle newsletter form submission
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    
    // In a real app, you would send this to your server
    console.log('Subscribed email:', email);
    
    // Show success message
    showToast('Thanks for subscribing!');
    
    // Reset form
    e.target.reset();
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // In a real app, you would send this to your server
    console.log('Contact form submitted:', { name, email, subject, message });
    
    // Show success message
    showToast('Your message has been sent!');
    
    // Reset form
    e.target.reset();
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Add show class
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add toast styles dynamically
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 5px;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
    }
    .toast.show {
        opacity: 1;
    }
`;
document.head.appendChild(toastStyles);