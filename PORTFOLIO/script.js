// Function to open the sidebar
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}

// Function to close the sidebar
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

// Scroll Animation Functionality
const elements = document.querySelectorAll('.animate__animated');

const scrollAnimation = () => {
    const windowHeight = window.innerHeight;
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.classList.add('animate__fadeInUp');
        }
    });
};

window.addEventListener('scroll', scrollAnimation);
window.addEventListener('load', scrollAnimation);
