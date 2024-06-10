// Initialize the map
var map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Dictionary to store markers for each user
var markers = {};

// Function to update the marker position
function updatePosition(user_id, lat, lng) {
    if (markers[user_id]) {
        markers[user_id].setLatLng([lat, lng]);
        markers[user_id].bindTooltip(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`).openTooltip();
    } else {
        markers[user_id] = L.marker([lat, lng]).addTo(map)
                            .bindTooltip(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`).openTooltip();
    }
    map.setView([lat, lng], 13);
}

// Get the device's current position
function getCurrentPosition(user_id) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            // Send the data to the server
            socket.emit('location_update', { user_id: user_id, lat: lat, lng: lng });
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
    var user_id = data.user_id;
    var lat = data.lat;
    var lng = data.lng;
    // Update the marker position
    updatePosition(user_id, lat, lng);
});

// Request the initial position of a specific user
function requestUserLocation(user_id) {
    socket.emit('request_user_location', { user_id: user_id });
}

// Example: Track your friend's phone
const friendUserId = 'friend123';
requestUserLocation(friendUserId);

// Example: Track your own phone
const myUserId = 'myUser123';
getCurrentPosition(myUserId);
