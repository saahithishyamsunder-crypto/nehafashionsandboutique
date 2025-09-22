// PRODUCT DATA: Add more items as needed
const productsData = [
    {
        id: 'kashmire1',
        category: 'kashmire',
        title: "Blue Kashmire Dress",
        price: 3499,
        sizes: ["S", "M", "L", "XL"],
        img: "image3.jpg"
    },
    {
        id: 'frock1',
        category: 'longfrocks',
        title: "Pink Designer Long Frock",
        price: 3999,
        sizes: ["S", "M", "L"],
        img: "image4.jpg"
    },
    {
        id: 'suit1',
        category: 'suits',
        title: "Navy Blue Embroidered Suit",
        price: 2899,
        sizes: ["M", "L", "XL"],
        img: "image2.jpg"
    },
    {
        id: 'lehenga1',
        category: 'lehenga',
        title: "Peach Bridal Lehenga",
        price: 7999,
        sizes: ["S", "M", "L"],
        img: "image2-3.jpg"
    },
    // Add more products here (img, title, price, size)
];
function shareWhatsAppSite() {
  const url = encodeURIComponent(window.location.href);
  window.open("https://wa.me/?text=Check%20out%20this%20boutique!%20" + url, "_blank");
}
function copySiteLink() {
  navigator.clipboard.writeText(window.location.href)
    .then(() => alert("Link copied!"));
}
function shareEmailSite() {
  const url = encodeURIComponent(window.location.href);
  window.location = "mailto:?subject=Check out this boutique!&body=See this at " + url;
}
// NAVIGATION LOGIC
const navLinks = document.querySelectorAll('nav a');
const homeSection = document.getElementById('home');
const productsSection = document.getElementById('products');
const cartSection = document.getElementById('cart');

// CATEGORY NAVIGATION
const categoryLinks = document.querySelectorAll('.category-list a');
categoryLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const category = link.getAttribute('href').substring(1);
        showProductsForCategory(category, link.textContent);
        setActiveNav(null);
        window.scrollTo(0, 0);
    });
});

function setActiveNav(name) {
    navLinks.forEach(link => {
        if (name && link.getAttribute('href').includes(name)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// NAVIGATION (Home, Categories, Cart)
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const hash = link.getAttribute('href').replace('#', '');
        if (hash === "home") {
            showHome();
        } else if (hash === "categories") {
            showCategories();
        } else if (hash === "cart") {
            showCart();

        }
        setActiveNav(hash);
    });
});

function showHome() {
    homeSection.style.display = "block";
    productsSection.style.display = "none";
    cartSection.style.display = "none";
}

function showCategories() {
    homeSection.style.display = "block";
    productsSection.style.display = "none";
    cartSection.style.display = "none";
    window.scrollTo(0, document.getElementById("categories").offsetTop - 80);
}

function showProductsForCategory(category, title) {
    document.getElementById('product-category-title').textContent = title;
    homeSection.style.display = "none";
    productsSection.style.display = "block";
    cartSection.style.display = "none";
    renderProducts(category);
}

function showCart() {
  document.getElementById('home').style.display = "none";
  document.getElementById('products').style.display = "none";
  document.getElementById('cart').style.display = "block";
}    renderCart();
document.getElementById('cart-link').addEventListener('click', showCart);
}

// PRODUCT RENDERING
function renderProducts(category) {
    const container = document.getElementById('products-list');
    container.innerHTML = '';
    const filtered = productsData.filter(p => p.category === category);
    filtered.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

// PRODUCT CARD
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <button class="product-share-btn" title="Share Product" onclick="shareProduct('${product.title}', '${window.location.href}')">&#128257;</button>
        <img src="${product.img}" alt="${product.title}">
        <div class="product-title">${product.title}</div>
        <div class="product-price">₹${product.price}</div>
        <div class="product-size">
            <label for="size-${product.id}">Size:</label>
            <select id="size-${product.id}">
                ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
            </select>
        </div>
        <button class="add-cart-btn" onclick="addToCart('${product.id}')">Add to Cart</button>
    `;
    return card;
}

// CART FUNCTIONALITY
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    const size = document.getElementById(`size-${productId}`).value;
    const itemKey = `${productId}-${size}`;
    const existing = cart.find(item => item.key === itemKey);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            key: itemKey,
            id: productId,
            title: product.title,
            size,
            price: product.price,
            img: product.img,
            qty: 1
        });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Added to cart!');
}

function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    let total = 0;
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty!</p>";
        document.getElementById('cart-total').textContent = "";
        return;
    }
    cart.forEach((item, i) => {
        total += item.price * item.qty;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span class="cart-item-title">${item.title}</span>
            <span class="cart-item-size">(${item.size})</span>
            <span class="cart-item-price">₹${item.price} x ${item.qty}</span>
            <span class="cart-item-remove" onclick="removeFromCart(${i})">&times;</span>
        `;
        cartItemsDiv.appendChild(div);
    });
    document.getElementById('cart-total').textContent = `Total: ₹${total}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

// CART CHECKOUT (basic)
document.getElementById("checkout-btn").onclick = function() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Thank you for your order! We'll contact you soon.");
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// SHARE FUNCTIONALITY
function shareSite() {
    if (navigator.share) {
        navigator.share({
            title: "Neha Fashion's & Boutique",
            url: window.location.href
        });
    } else {
        prompt("Copy this url to share:", window.location.href);
    }
}

function shareProduct(title, url) {
    if (navigator.share) {
        navigator.share({
            title,
            url
        });
    } else {
        prompt("Copy this product url to share:", url);
    }
}

// INIT
function showInitialPage() {
    showHome();
    setActiveNav('home');
    updateCartCount();
}
showInitialPage();

// Expose for button onclick
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.shareProduct = shareProduct;
window.shareSite = shareSite;
// ...previous product/cart/share functions...

// NAVIGATION LOGIC (add new for checkout)
const navLinks = document.querySelectorAll('nav a');
const homeSection = document.getElementById('home');
const productsSection = document.getElementById('products');
const cartSection = document.getElementById('cart');
const checkoutSection = document.getElementById('checkout');
const orderModal = document.getElementById('order-success-modal');

// ...category and nav code as before...

// Show Sections
function showHome() {
    homeSection.style.display = "block";
    productsSection.style.display = "none";
    cartSection.style.display = "none";
    checkoutSection.style.display = "none";
}

function showCategories() {
    homeSection.style.display = "block";
    productsSection.style.display = "none";
    cartSection.style.display = "none";
    checkoutSection.style.display = "none";
    window.scrollTo(0, document.getElementById("categories").offsetTop - 80);
}

function showProductsForCategory(category, title) {
    document.getElementById('product-category-title').textContent = title;
    homeSection.style.display = "none";
    productsSection.style.display = "block";
    cartSection.style.display = "none";
    checkoutSection.style.display = "none";
    renderProducts(category);
}

function showCart() {
    homeSection.style.display = "none";
    productsSection.style.display = "none";
    cartSection.style.display = "block";
    checkoutSection.style.display = "none";
    renderCart();
}

function showCheckout() {
    homeSection.style.display = "none";
    productsSection.style.display = "none";
    cartSection.style.display = "none";
    checkoutSection.style.display = "block";
    populatePaymentDetails();
    document.getElementById('checkout-form').reset();
}

document.getElementById("checkout-btn").onclick = function() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    showCheckout();
}

// --- Payment Details Logic ---
function populatePaymentDetails() {
    const paymentMethod = document.getElementById('payment-method');
    const paymentDetails = document.getElementById('payment-details');
    function updateFields() {
        if (paymentMethod.value === 'card') {
            paymentDetails.innerHTML = `
                <div class="checkout-field">
                    <label for="card-number">Card Number</label>
                    <input type="text" id="card-number" name="card-number" maxlength="16" required>
                </div>
                <div class="checkout-field">
                    <label for="card-expiry">Expiry Date</label>
                    <input type="text" id="card-expiry" name="card-expiry" placeholder="MM/YY" required>
                </div>
                <div class="checkout-field">
                    <label for="card-cvv">CVV</label>
                    <input type="password" id="card-cvv" name="card-cvv" maxlength="3" required>
                </div>
            `;
        } else if (paymentMethod.value === 'upi') {
            paymentDetails.innerHTML = `
                <div class="checkout-field">
                    <label for="upi-id">Your UPI ID</label>
                    <input type="text" id="upi-id" name="upi-id" placeholder="example@upi" required>
                </div>
            `;
        } else {
            paymentDetails.innerHTML = '';
        }
    }
    paymentMethod.onchange = updateFields;
    updateFields();
}

// --- Handle Checkout Submission ---
document.getElementById("checkout-form").onsubmit = function(e) {
    e.preventDefault();
    // (In real site, send order to backend here)
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showHome();
    orderModal.style.display = 'flex';
}
function closeOrderModal() {
    orderModal.style.display = 'none';
    showHome();
}

// ...rest of previous product/cart/share code...

// Expose for button onclick
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.shareProduct = shareProduct;
window.shareSite = shareSite;
window.showCart = showCart;
window.closeOrderModal = closeOrderModal;

// On load
function showInitialPage() {
    showHome();
    setActiveNav('home');
    updateCartCount();
}
showInitialPage();