// 1. DOM se map element ko select karein
const mapElement = document.getElementById("map");

// 2. Element se saara dataset data nikaalein
const coordinates = JSON.parse(mapElement.dataset.coordinates); // Array: [lng, lat]
const listingTitle = mapElement.dataset.title; // String
const listingLocation = mapElement.dataset.location; // String

// 3. Coordinates ko set karein (Leaflet ke liye [lat, lng] format)
const lng = coordinates[0];
const lat = coordinates[1];

// 4. Leaflet Map Initialize karein
const map = L.map("map").setView([lat, lng], 9);

// OpenStreetMap Tiles add karein
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// 5. Marker lagayein aur dynamic Title & Location popup mein dikhayein
L.marker([lat, lng])
  .addTo(map)
  .bindPopup(`<b>${listingTitle}</b><p>${listingLocation}</p>`)
  .openPopup();
