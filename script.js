// API Key - Sign up at openweathermap.org to get your own free API key
const API_KEY = 'a2d0c701e76fdeb5be683137bff83699'; // Replace with your actual API key

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const temp = document.getElementById('temp');
const weatherIcon = document.getElementById('weather-icon');
const weatherDesc = document.getElementById('weather-desc');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const errorMessage = document.getElementById('error-message');

// Event Listeners
searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeather();
    }
});

// Fetch weather data from API
async function fetchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        displayWeather(data);
        errorMessage.style.display = 'none';
    } catch (error) {
        showError('City not found. Please try again.');
        console.error('Error fetching weather data:', error);
    }
}

// Display weather data
function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    const now = new Date();
    currentDate.textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    temp.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity;
    wind.textContent = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    
    // Set weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].main;
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Clear weather data
    cityName.textContent = '--';
    currentDate.textContent = '--';
    temp.textContent = '--';
    weatherDesc.textContent = '--';
    humidity.textContent = '--';
    wind.textContent = '--';
    weatherIcon.src = '';
}

// Initialize with default city
window.addEventListener('load', () => {
    cityInput.value = 'London';
    fetchWeather();
});