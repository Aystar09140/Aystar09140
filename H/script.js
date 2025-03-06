// Function to handle room booking
function bookRoom(roomType) {
    alert(`You have booked a ${roomType} room!`);
}

// Example of adding event listeners to booking buttons
document.querySelectorAll('.hotel-card a').forEach(button => {
    button.addEventListener('click', function() {
        const roomType = this.parentElement.parentElement.querySelector('h3').innerText;
        bookRoom(roomType);
    });
});
