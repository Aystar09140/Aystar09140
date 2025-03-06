// Initialize ScrollReveal
const sr = ScrollReveal({
    origin: 'bottom', // Animation starts from the bottom
    distance: '60px', // Distance to animate
    duration: 1000, // Animation duration in milliseconds
    delay: 200, // Delay before animation starts
    reset: true // Reset animation on scroll up
});

// Apply ScrollReveal to specific elements
sr.reveal('.w3-container', { interval: 200 }); // Animate each container with a delay
sr.reveal('.card', { interval: 200 }); // Animate each card with a delay
sr.reveal('#contact', { delay: 300 }); // Animate the contact section
// Custom animation for the header
sr.reveal('header', {
    origin: 'top',
    distance: '80px',
    duration: 1200,
    delay: 100,
    easing: 'ease-in-out'
});

// Custom animation for the about section
sr.reveal('#about', {
    origin: 'left',
    distance: '100px',
    duration: 1000,
    delay: 200,
    easing: 'ease-in-out'
});sr.reveal('.test-element', {
    origin: 'left',
    distance: '100px',
    duration: 1000,
    delay: 200,
    easing: 'ease-in-out'
});