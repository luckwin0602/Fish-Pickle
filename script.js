// ============ SMOOTH SCROLLING ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============ HAMBURGER MENU ============
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.flexDirection = 'column';
    navLinks.style.backgroundColor = 'white';
    navLinks.style.zIndex = '99';
});

// ============ INTERACTIVE MAP INITIALIZATION ============
document.addEventListener('DOMContentLoaded', function() {
    // Chinnamuttom, Kanyakumari coordinates
    const latitude = 8.0883;
    const longitude = 77.5385;
    
    // Initialize the map
    const map = L.map('map').setView([latitude, longitude], 16);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
        minZoom: 2
    }).addTo(map);
    
    // Create custom marker
    const goldIcon = L.divIcon({
        html: `<div style="
            background: linear-gradient(135deg, #FF6B35, #F7931E);
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            border: 3px solid white;
        ">🐟</div>`,
        iconSize: [40, 40],
        className: 'map-marker'
    });
    
    // Add marker to map
    const marker = L.marker([latitude, longitude], { icon: goldIcon }).addTo(map);
    
    // Add popup to marker
    marker.bindPopup(`
        <div style="font-family: 'Segoe UI', sans-serif;">
            <h4 style="color: #FF6B35; margin: 0 0 8px 0;">🐟 Golden Fish Pickles</h4>
            <p style="margin: 5px 0; font-size: 0.9rem;">
                <strong>Chinnamuttom, Kanyakumari</strong><br>
                Tamilnadu, India<br><br>
                <strong>📞</strong> +91-484-2345678<br>
                <strong>📧</strong> info@goldenfishpickles.com
            </p>
        </div>
    `, {
        maxWidth: 250,
        className: 'custom-popup'
    });
    
    // Open popup by default
    marker.openPopup();
    
    // Add circle radius around location
    L.circle([latitude, longitude], {
        color: '#FF6B35',
        fillColor: '#F7931E',
        fillOpacity: 0.1,
        weight: 2,
        radius: 500 // 500 meters
    }).addTo(map);
    
    // Recenter map on window resize
    window.addEventListener('resize', function() {
        map.invalidateSize();
    });
});

// ============ ORDER MODAL FUNCTIONALITY ============
const orderModal = document.getElementById('orderModal');
const orderNowBtn = document.getElementById('orderNowBtn');
const closeModalBtn = document.querySelector('.close-modal');
const whatsappBtn = document.getElementById('whatsappBtn');
const orderForm = document.getElementById('orderForm');
const productSelect = document.getElementById('productSelect');
const quantityInput = document.getElementById('quantity');
const qtyPlusBtn = document.getElementById('qtyPlus');
const qtyMinusBtn = document.getElementById('qtyMinus');

// Product prices
const productPrices = {
    'Classic Fish Pickle - ₹299': 299,
    'Spicy Fish Pickle - ₹329': 329,
    'Lemon Fish Pickle - ₹309': 309,
    'Premium Blend - ₹399': 399
};

// Open modal when Order Now button is clicked
orderNowBtn.addEventListener('click', () => {
    orderModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Close modal when X is clicked
closeModalBtn.addEventListener('click', () => {
    orderModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        orderModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Quantity increment
qtyPlusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    quantityInput.value = parseInt(quantityInput.value) + 1;
    updateOrderSummary();
});

// Quantity decrement
qtyMinusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
    updateOrderSummary();
});

// Update summary when product changes
productSelect.addEventListener('change', updateOrderSummary);
quantityInput.addEventListener('change', updateOrderSummary);

// Update order summary
function updateOrderSummary() {
    const selectedProduct = productSelect.value;
    const quantity = parseInt(quantityInput.value) || 1;
    
    const summaryProduct = document.getElementById('summaryProduct');
    const summaryQty = document.getElementById('summaryQty');
    const totalPrice = document.getElementById('totalPrice');
    
    if (selectedProduct) {
        const price = productPrices[selectedProduct];
        const total = price * quantity;
        
        summaryProduct.textContent = selectedProduct;
        summaryQty.textContent = quantity;
        totalPrice.textContent = total;
    } else {
        summaryProduct.textContent = '-';
        summaryQty.textContent = quantity;
        totalPrice.textContent = '0';
    }
}

// WhatsApp Order
whatsappBtn.addEventListener('click', () => {
    const selectedProduct = productSelect.value;
    const quantity = quantityInput.value;
    
    if (!selectedProduct) {
        showToast('Please select a product first');
        return;
    }
    
    const price = productPrices[selectedProduct];
    const total = price * quantity;
    
    const message = encodeURIComponent(
        `Hello! I would like to order:\n\n` +
        `📦 Product: ${selectedProduct}\n` +
        `📊 Quantity: ${quantity}\n` +
        `💰 Total: ₹${total}\n\n` +
        `Please confirm availability and delivery details.\n` +
        `Thank you!`
    );
    
    // WhatsApp number for Golden Fish Pickles
    const phoneNumber = '919876543210'; // Format: country code + number without +
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    
    showToast('Opening WhatsApp...');
});

// Form submission
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;
    const email = document.getElementById('orderEmail').value;
    const address = document.getElementById('orderAddress').value;
    const product = productSelect.value;
    const quantity = quantityInput.value;
    const price = productPrices[product];
    const total = price * quantity;
    
    if (!name || !phone || !address || !product) {
        showToast('Please fill in all required fields');
        return;
    }
    
    // Create order summary for display
    const orderSummary = {
        name,
        phone,
        email,
        address,
        product,
        quantity,
        total
    };
    
    // Show success message
    showToast(`✅ Order received! We'll contact you at ${phone} to confirm. Thank you!`);
    
    // Log the order (in real scenario, send to server)
    console.log('Order Details:', orderSummary);
    
    // Send email notification (simulated)
    sendOrderNotification(orderSummary);
    
    // Reset form and close modal
    orderForm.reset();
    quantityInput.value = 1;
    productSelect.value = '';
    updateOrderSummary();
    
    setTimeout(() => {
        orderModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 1500);
});

// Send order notification
function sendOrderNotification(orderData) {
    const emailMessage = `
        New Order Received!
        
        Customer Name: ${orderData.name}
        Phone: ${orderData.phone}
        Email: ${orderData.email}
        
        Product: ${orderData.product}
        Quantity: ${orderData.quantity}
        Total: ₹${orderData.total}
        
        Delivery Address:
        ${orderData.address}
        
        Order Time: ${new Date().toLocaleString()}
    `;
    
    console.log('Order notification would be sent to: info@goldenfishpickles.com');
    console.log(emailMessage);
}

// ============ ADD TO CART FUNCTIONALITY ============
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const price = productCard.querySelector('.price').textContent;
        
        // Find corresponding option in select dropdown
        const fullProductName = Array.from(productSelect.options)
            .find(opt => opt.value && opt.value.includes(productName));
        
        if (fullProductName) {
            // Open modal and select product
            orderModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            productSelect.value = fullProductName.value;
            updateOrderSummary();
            
            // Scroll to top of modal
            document.querySelector('.order-modal-content').scrollTop = 0;
        }
        
        // Show toast
        showToast(`${productName} added! 🛒 Complete your order in the form.`);
        
        // Button animation
        this.textContent = '✓ Added to Order';
        this.style.background = '#4CAF50';
        
        setTimeout(() => {
            this.textContent = 'Add to Cart';
            this.style.background = 'linear-gradient(135deg, #FF6B35, #F7931E)';
        }, 2000);
    });
});

// ============ TOAST NOTIFICATION ============
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInLeft 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============ CONTACT FORM ============
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Basic validation
        if (name && email && message) {
            showToast(`Thank you ${name}! We'll contact you at ${email} soon.`);
            
            // Clear form
            this.reset();
            
            // In a real application, you would send this data to a server
            console.log('Form submitted:', { name, email, message });
        } else {
            showToast('Please fill in all fields');
        }
    });
}

// ============ SCROLL ANIMATIONS ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.dataset.animation || 'slideInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.product-card, .info-card, .about-text').forEach(el => {
    observer.observe(el);
});

// ============ NAVBAR SCROLL EFFECT ============
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ============ ACTIVE NAV LINK ============
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============ COUNTER ANIMATION ============
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// ============ PAGE LOAD ANIMATION ============
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============ PARALLAX EFFECT (Optional Enhancement) ============
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const fishAnimation = document.querySelector('.fish-animation');
    
    if (hero && fishAnimation) {
        const scrollPosition = window.scrollY;
        fishAnimation.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
});

// ============ MOUSE FOLLOW EFFECT ON PRODUCTS ============
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 107, 53, 0.1), var(--light-bg))`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.background = 'var(--light-bg)';
    });
});

// ============ DYNAMIC PRODUCT COUNTER ============
function updateProductCounter() {
    const productCount = document.querySelectorAll('.product-card').length;
    console.log(`Total Products: ${productCount}`);
}

updateProductCounter();

// ============ KEYBOARD NAVIGATION ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        window.scrollBy(0, 100);
    } else if (e.key === 'ArrowUp') {
        window.scrollBy(0, -100);
    }
});

// ============ MODAL-LIKE POPUPS FOR PRODUCTS ============
class ProductModal {
    constructor() {
        this.modal = null;
    }
    
    createModal(productName, price, description) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 400px;
                animation: scaleIn 0.3s ease;
            ">
                <h2>${productName}</h2>
                <p>${description}</p>
                <p style="font-size: 1.5rem; color: #FF6B35; font-weight: bold;">${price}</p>
                <button onclick="this.closest('div').parentElement.remove()" style="
                    width: 100%;
                    padding: 10px;
                    background: #FF6B35;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}

const productModal = new ProductModal();

// ============ LOADING ANIMATION ============
window.addEventListener('load', () => {
    console.log('Website loaded successfully!');
    // Add any post-load animations here
});

// ============ SERVICE WORKER REGISTRATION (Optional) ============
if ('serviceWorker' in navigator) {
    // Uncomment to enable offline support
    // navigator.serviceWorker.register('sw.js');
}
