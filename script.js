// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display products
const productList = document.getElementById('product-list');
if (productList) {
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <strong>$${product.price.toFixed(2)}</strong><br/>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(card);
  });
}

// Add to cart function
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({...product, quantity: 1});
  }
  
  saveCart();
  showNotification(`${product.name} added to cart!`);
  updateCartCount();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 2000);
}

// Update cart count in navbar
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems > 0 ? `(${totalItems})` : '';
  }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  
  // Display cart items if on cart page
  if (document.getElementById('cart-items')) {
    displayCartItems();
  }
});


// Display cart items with quantity controls
function displayCartItems() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty</p>';
    cartTotal.textContent = '$0.00';
    return;
  }
  
  let total = 0;
  cartItems.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p>$${item.price.toFixed(2)}</p>
        </div>
        <div class="quantity-controls">
          <button onclick="decreaseQuantity(${item.id})">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${item.id})">+</button>
        </div>
        <div class="item-total">$${itemTotal.toFixed(2)}</div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
      </div>
    `;
  }).join('');
  
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Increase quantity of an item
function increaseQuantity(productId) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += 1;
    saveCart();
    displayCartItems();
    updateCartCount();
  }
}

// Decrease quantity of an item
function decreaseQuantity(productId) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      // Remove item if quantity would go to 0
      cart.splice(itemIndex, 1);
    }
    saveCart();
    displayCartItems();
    updateCartCount();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  displayCartItems();
  updateCartCount();
}

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('nav-list');
    
    if (hamburger && navList) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navList.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (navList.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.navli a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navList.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});