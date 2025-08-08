// ✅ Replace with your OpenWeatherMap API Key
const API_KEY = "6dac63954a9f5caf74e0326f7a6e7cfa";

// Initialize map
const map = L.map('map', {
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: 'topleft'
    }
}).setView([20.5937, 78.9629], 4);

// Base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Weather Layers
const temperatureLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`, {
    opacity: 0.6
});

const cloudsLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`, {
    opacity: 0.6
});

const windLayer = L.tileLayer(`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`, {
    opacity: 0.6
});

const precipitationLayer = L.tileLayer(`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`, {
    opacity: 0.6
});

// Layer Control
const overlayMaps = {
    "🌡 Temperature": temperatureLayer,
    "☁ Clouds": cloudsLayer,
    "💨 Wind": windLayer,
    "🌧 Rain": precipitationLayer
};

L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);

// Default active layer
temperatureLayer.addTo(map);

// Add Marker
function addCityMarker(lat, lon, cityName) {
    L.marker([lat, lon]).addTo(map)
    .bindPopup(`<b>${cityName}</b><br>Weather info here...`)
    .openPopup();
}

// Example Marker for Delhi
addCityMarker(28.6139, 77.2090, "Delhi");

// Search Button Functionality
document.getElementById("mapSearchBtn").addEventListener("click", () => {
    const city = document.getElementById("mapCityInput").value.trim();
    if (!city) return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
          if (data.coord) {
              map.setView([data.coord.lat, data.coord.lon], 8);
              addCityMarker(data.coord.lat, data.coord.lon, city);
          } else {
              alert("City not found");
          }
      })
      .catch(err => console.error(err));
});