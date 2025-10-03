// DOM elements
const modal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.getElementsByClassName("close")[0];
const loginForm = document.getElementById("loginForm");
const passwordToggle = document.getElementById("passwordToggle");
const passwordInput = document.getElementById("password");
const usernameInput = document.getElementById("username");
const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");

// Modal functionality
function openModal() {
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
    usernameInput.focus(); // Focus on first input
}

function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Restore scrolling
    clearForm(); // Clear form when closing
}

// Event listeners
loginBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

// Close modal when clicking outside
window.addEventListener("click", function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && modal.style.display === "block") {
        closeModal();
    }
});

// Password visibility toggle
passwordToggle.addEventListener("click", function() {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    
    const icon = passwordToggle.querySelector("i");
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
});

// Form validation
function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    clearErrors();
    
    // Username validation
    const username = usernameInput.value.trim();
    if (!username) {
        showError(usernameError, "Username or email is required");
        isValid = false;
    } else if (username.length < 3) {
        showError(usernameError, "Username must be at least 3 characters");
        isValid = false;
    }
    
    // Password validation
    const password = passwordInput.value;
    if (!password) {
        showError(passwordError, "Password is required");
        isValid = false;
    } else if (password.length < 6) {
        showError(passwordError, "Password must be at least 6 characters");
        isValid = false;
    }
    
    return isValid;
}

function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

function clearErrors() {
    usernameError.style.display = "none";
    passwordError.style.display = "none";
}

function clearForm() {
    loginForm.reset();
    clearErrors();
    // Reset password visibility
    passwordInput.setAttribute("type", "password");
    const icon = passwordToggle.querySelector("i");
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
}

// Real-time validation
usernameInput.addEventListener("blur", function() {
    const username = this.value.trim();
    if (username && username.length < 3) {
        showError(usernameError, "Username must be at least 3 characters");
    } else {
        usernameError.style.display = "none";
    }
});

passwordInput.addEventListener("blur", function() {
    const password = this.value;
    if (password && password.length < 6) {
        showError(passwordError, "Password must be at least 6 characters");
    } else {
        passwordError.style.display = "none";
    }
});

// Form submission
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    
    if (validateForm()) {
        // Show loading state
        const submitBtn = this.querySelector(".submit-btn");
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showSuccessMessage();
            
            // Close modal after delay
            setTimeout(() => {
                closeModal();
            }, 2000);
        }, 2000);
    }
});

function showSuccessMessage() {
    // Create success notification
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = '<i class="fas fa-check-circle"></i> Login successful!';
    
    // Add animation keyframes
    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = "slideInRight 0.3s ease reverse";
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 300);
    }, 3000);
}

// Social login buttons
document.querySelectorAll(".social-btn").forEach(btn => {
    btn.addEventListener("click", function() {
        const provider = this.classList.contains("google-btn") ? "Google" : "Facebook";
        alert(`${provider} login would be implemented here`);
    });
});

// Forgot password link
document.querySelector(".forgot-password").addEventListener("click", function(event) {
    event.preventDefault();
    alert("Password reset functionality would be implemented here");
});

// Sign up link
document.querySelector(".signup-link a").addEventListener("click", function(event) {
    event.preventDefault();
    alert("Sign up page would be implemented here");
});