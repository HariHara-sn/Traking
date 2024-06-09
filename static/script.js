// Initialize the map
var map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
 
// Add a marker to the map
var marker = L.marker([51.505, -0.09]).addTo(map);

// Function to update the marker position
function updatePosition(lat, lng) {
    marker.setLatLng([lat, lng]);
    map.setView([lat, lng], 13);
}

// Get the device's current position
function getCurrentPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            // Send the data to the server
            socket.emit('location_update', { lat: lat, lng: lng });
        }, (error) => {
            console.error('Error getting location: ', error);
        }, {
            enableHighAccuracy: true
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Connect to the Flask-SocketIO server
var socket = io();

// Listen for location updates from the server
socket.on('location_update', function(data) {
    var lat = data.lat;
    var lng = data.lng;
    // Update the marker position
    updatePosition(lat, lng);
});

// Get the current position and watch for changes
getCurrentPosition();
