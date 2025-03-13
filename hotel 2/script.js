// scripts.js
document.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[index].classList.add('active');
        }
    });
});

// Initialize scroll animations
function initializeScrollAnimations() {
    const elements = document.querySelectorAll('.section-header, .room-card, .service-card, .blog-card, .review-card, .info-item');
    
    // Add scroll-reveal class to all elements we want to animate
    elements.forEach((element, index) => {
        // Add different animation directions for alternating elements
        if (index % 2 === 0) {
            element.classList.add('scroll-reveal', 'fade-left');
        } else {
            element.classList.add('scroll-reveal', 'fade-right');
        }
    });

    // Add scroll-reveal to specific elements with delays
    document.querySelectorAll('.hero-content > *').forEach((element, index) => {
        element.classList.add('scroll-reveal', `delay-${index + 1}`);
    });

    // Create the intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Stop observing the element after it's revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(element => {
        observer.observe(element);
    });
}

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeNavigation();
    initializeAnimations();
    initializeBooking();
    initializeForms();
    initializeGallery();
    initializeReviews();
    initializeScrollEffects();
    initializeBlogCards();
    initializeBookingDropdown();
    initializeScrollAnimations();
}

// Navigation
function initializeNavigation() {
    const nav = document.querySelector('.main-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScroll = 0;

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
        document.body.classList.toggle('nav-open');
    });

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                document.body.classList.remove('nav-open');
            }
        });
    });

    // Hide/Show navigation on scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Update nav background
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Hide/Show nav
        if (currentScroll > lastScroll && currentScroll > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;

        // Update active nav link
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionBottom = sectionTop + section.offsetHeight;
        const currentScroll = window.pageYOffset;

        if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${section.id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Booking System
function initializeBooking() {
    const modal = document.getElementById('bookingModal');
    const bookButtons = document.querySelectorAll('.btn-book');
    const closeButton = document.querySelector('.modal-close');
    const bookingForm = document.getElementById('bookingForm');

    // Open modal
    bookButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const roomType = btn.dataset.room;
            document.getElementById('suite').value = roomType;
            openModal(modal);
        });
    });

    // Close modal when clicking the X button
    if (closeButton) {
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal(modal);
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });

    // Add keyboard support for closing modal (Escape key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal(modal);
        }
    });

    // Form validation and submission
    bookingForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Validate dates
        const checkin = new Date(form.checkin.value);
        const checkout = new Date(form.checkout.value);
        
        if (checkout <= checkin) {
            showNotification('Check-out date must be after check-in date', 'error');
            return;
        }
        
        try {
            submitButton.classList.add('loading');
            await processBooking(new FormData(form));
            showNotification('Booking confirmed successfully!', 'success');
            closeModal(modal);
            form.reset();
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            submitButton.classList.remove('loading');
        }
    });
}

// Form Handling
function initializeForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        if (form.id === 'bookingForm') return; // Skip booking form as it's handled separately

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');

            try {
                submitButton.classList.add('loading');
                await processFormSubmission(new FormData(form), form.id);
                showNotification('Form submitted successfully!', 'success');
                form.reset();
            } catch (error) {
                showNotification(error.message, 'error');
            } finally {
                submitButton.classList.remove('loading');
            }
        });
    });
}

// Gallery
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            openLightbox(imgSrc);
        });
    });
}

// Reviews Slider
function initializeReviews() {
    const slider = document.querySelector('.reviews-slider');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('touchend', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Blog Cards
function initializeBlogCards() {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Add this new function for booking dropdown
function initializeBookingDropdown() {
    const bookNowContainer = document.querySelector('.book-now-container');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const modal = document.getElementById('bookingModal');

    // For mobile devices
    if (window.innerWidth <= 768) {
        const bookNowButton = bookNowContainer.querySelector('.book-now');
        const dropdown = bookNowContainer.querySelector('.booking-dropdown');
        
        bookNowButton.addEventListener('click', (e) => {
            e.preventDefault();
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });
    }

    // Handle dropdown item clicks
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const roomType = item.dataset.room;
            document.getElementById('suite').value = roomType;
            openModal(modal);
            
            // Hide dropdown on mobile after selection
            if (window.innerWidth <= 768) {
                bookNowContainer.querySelector('.booking-dropdown').style.display = 'none';
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!bookNowContainer.contains(e.target) && window.innerWidth <= 768) {
            const dropdown = bookNowContainer.querySelector('.booking-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }
        }
    });
}

// Utility Functions
function openModal(modal) {
    if (!modal) return;
    
    // Reset form if exists
    const form = modal.querySelector('form');
    if (form) form.reset();
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animate modal content
    const content = modal.querySelector('.modal-content');
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        });
    }
}

function closeModal(modal) {
    if (!modal) return;
    
    const content = modal.querySelector('.modal-content');
    if (content) {
        // Start closing animation
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
    }
    
    // Delay hiding the modal to allow for animation
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset content styles after modal is hidden
        if (content) {
            content.style.opacity = '';
            content.style.transform = '';
        }
        
        // Reset form if exists
        const form = modal.querySelector('form');
        if (form) form.reset();
    }, 300);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add icon based on type
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    notification.prepend(icon);
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Animate out
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function openLightbox(imgSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close">&times;</button>
            <img src="${imgSrc}" alt="Gallery Image">
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Animate lightbox
    setTimeout(() => lightbox.classList.add('show'), 10);
    
    // Close handlers
    const close = () => {
        lightbox.classList.remove('show');
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = 'auto';
        }, 300);
    };
    
    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });
}

// API Simulation
async function processBooking(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = Object.fromEntries(formData);
            console.log('Processing booking:', data);
            
            if (Math.random() > 0.1) { // 90% success rate
                resolve();
            } else {
                reject(new Error('Unable to process booking. Please try again.'));
            }
        }, 1500);
    });
}

async function processFormSubmission(formData, formId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = Object.fromEntries(formData);
            console.log(`Processing ${formId} submission:`, data);
            
            if (Math.random() > 0.1) { // 90% success rate
                resolve();
            } else {
                reject(new Error('Unable to process submission. Please try again.'));
            }
        }, 1000);
    });
}

function formatPrice(amount) {
    return `₦${amount.toLocaleString('en-NG')}`;
}

// Update price display in booking form
function updatePriceDisplay(price) {
    const formattedPrice = formatPrice(parseInt(price));
    document.querySelector('.booking-price').textContent = formattedPrice;
}