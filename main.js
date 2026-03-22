/* ═══════════════════════════════════════════════════════
   WeatherApp — Main JavaScript
   Integrates OpenWeatherMap + Unsplash APIs
   ═══════════════════════════════════════════════════════ */

// ─── API Configuration ────────────────────────────────

function getApiKeys() {
    return {
        openWeather: localStorage.getItem("owm_api_key") || "",
        unsplash: localStorage.getItem("unsplash_api_key") || "",
    };
}

function saveApiKeys(owmKey, unsplashKey) {
    localStorage.setItem("owm_api_key", owmKey.trim());
    localStorage.setItem("unsplash_api_key", unsplashKey.trim());
}

function hasApiKeys() {
    const keys = getApiKeys();
    return keys.openWeather.length > 0 && keys.unsplash.length > 0;
}

// ─── Fallback Data (used when APIs aren't configured) ──

const fallbackCities = [
    // ── India (20 cities) ────────────────────────────────
    { name: "Mumbai", country: "India", region: "India", temp: 32, condition: "Humid & partly cloudy", description: "Warm tropical air with scattered clouds over the Arabian Sea.", icon: "partly_cloudy_day", wind: "West, 14.2 km/h", image: "/cities/mumbai.png" },
    { name: "Delhi", country: "India", region: "India", temp: 35, condition: "Hazy sunshine", description: "Hot and hazy skies with dry north Indian heat.", icon: "wb_sunny", wind: "NW, 10.5 km/h", image: "/bg.png" },
    { name: "Bangalore", country: "India", region: "India", temp: 27, condition: "Pleasant & breezy", description: "Cool garden city breeze with pleasant temperatures.", icon: "partly_cloudy_day", wind: "East, 8.1 km/h", image: "/bg.png" },
    { name: "Chennai", country: "India", region: "India", temp: 34, condition: "Hot & humid", description: "Sweltering coastal heat with muggy tropical air.", icon: "wb_sunny", wind: "South, 12.3 km/h", image: "/bg.png" },
    { name: "Kolkata", country: "India", region: "India", temp: 33, condition: "Partly cloudy", description: "Warm and humid with occasional cloud cover.", icon: "partly_cloudy_day", wind: "SE, 9.7 km/h", image: "/bg.png" },
    { name: "Hyderabad", country: "India", region: "India", temp: 36, condition: "Sunny & dry", description: "Clear Deccan skies with dry, scorching heat.", icon: "wb_sunny", wind: "West, 7.2 km/h", image: "/bg.png" },
    { name: "Pune", country: "India", region: "India", temp: 30, condition: "Clear sky", description: "Pleasant weather with clear blue skies over the Western Ghats.", icon: "wb_sunny", wind: "NW, 11.0 km/h", image: "/bg.png" },
    { name: "Ahmedabad", country: "India", region: "India", temp: 38, condition: "Hot & dry", description: "Intense dry heat under blazing Gujarati skies.", icon: "wb_sunny", wind: "West, 8.5 km/h", image: "/bg.png" },
    { name: "Jaipur", country: "India", region: "India", temp: 37, condition: "Sunny & warm", description: "Bright sunshine over the Pink City — warm desert air.", icon: "wb_sunny", wind: "NW, 13.0 km/h", image: "/bg.png" },
    { name: "Lucknow", country: "India", region: "India", temp: 34, condition: "Hazy", description: "Warm and hazy with light dust in the air.", icon: "cloud", wind: "East, 6.4 km/h", image: "/bg.png" },
    { name: "Chandigarh", country: "India", region: "India", temp: 31, condition: "Partly cloudy", description: "Mild weather with some cloud cover — breezy and warm.", icon: "partly_cloudy_day", wind: "NW, 9.0 km/h", image: "/bg.png" },
    { name: "Kochi", country: "India", region: "India", temp: 30, condition: "Tropical showers", description: "Scattered tropical showers along the Kerala coast.", icon: "rainy", wind: "West, 15.5 km/h", image: "/bg.png" },
    { name: "Varanasi", country: "India", region: "India", temp: 35, condition: "Hot & humid", description: "Warm and humid along the banks of the Ganga.", icon: "wb_sunny", wind: "East, 5.8 km/h", image: "/bg.png" },
    { name: "Goa", country: "India", region: "India", temp: 31, condition: "Sunny & breezy", description: "Warm coastal sunshine with a gentle sea breeze.", icon: "wb_sunny", wind: "West, 16.2 km/h", image: "/bg.png" },
    { name: "Srinagar", country: "India", region: "India", temp: 15, condition: "Cool & cloudy", description: "Cool mountain air with clouds over Dal Lake.", icon: "cloud", wind: "North, 7.5 km/h", image: "/bg.png" },
    { name: "Amritsar", country: "India", region: "India", temp: 33, condition: "Warm & clear", description: "Clear skies with warm Punjab heat.", icon: "wb_sunny", wind: "NW, 10.3 km/h", image: "/bg.png" },
    { name: "Indore", country: "India", region: "India", temp: 34, condition: "Sunny", description: "Bright sunshine over central India — warm and dry.", icon: "wb_sunny", wind: "West, 8.0 km/h", image: "/bg.png" },
    { name: "Bhopal", country: "India", region: "India", temp: 33, condition: "Partly cloudy", description: "Warm with intermittent clouds over the City of Lakes.", icon: "partly_cloudy_day", wind: "NW, 7.8 km/h", image: "/bg.png" },
    { name: "Coimbatore", country: "India", region: "India", temp: 29, condition: "Pleasant", description: "Mild and pleasant weather near the Western Ghats.", icon: "partly_cloudy_day", wind: "East, 9.2 km/h", image: "/bg.png" },
    { name: "Visakhapatnam", country: "India", region: "India", temp: 32, condition: "Warm & humid", description: "Coastal humidity with warm sea breezes.", icon: "partly_cloudy_day", wind: "SE, 11.5 km/h", image: "/bg.png" },
    { name: "Thiruvananthapuram", country: "India", region: "India", temp: 30, condition: "Tropical rain", description: "Tropical rain showers along Kerala's southern coast.", icon: "rainy", wind: "West, 13.8 km/h", image: "/bg.png" },

    // ── Asia ──────────────────────────────────────────────
    { name: "Tokyo", country: "Japan", region: "Asia", temp: 22, condition: "Clear sky", description: "Crystal clear skies with warm sunshine.", icon: "wb_sunny", wind: "South, 5.2 km/h", image: "/cities/tokyo.png" },
    { name: "Dubai", country: "UAE", region: "Asia", temp: 38, condition: "Hot & sunny", description: "Blazing sunshine with scorching desert heat.", icon: "wb_sunny", wind: "NW, 6.8 km/h", image: "/cities/dubai.png" },
    { name: "Singapore", country: "Singapore", region: "Asia", temp: 31, condition: "Thunderstorm", description: "Tropical thunderstorm with warm, humid air.", icon: "thunderstorm", wind: "South, 8.0 km/h", image: "/bg.png" },
    { name: "Bangkok", country: "Thailand", region: "Asia", temp: 34, condition: "Hot & humid", description: "Sweltering tropical heat with high humidity.", icon: "wb_sunny", wind: "South, 6.5 km/h", image: "/bg.png" },
    { name: "Seoul", country: "South Korea", region: "Asia", temp: 18, condition: "Partly cloudy", description: "Cool autumn air with scattered clouds.", icon: "partly_cloudy_day", wind: "West, 12.0 km/h", image: "/bg.png" },
    { name: "Beijing", country: "China", region: "Asia", temp: 20, condition: "Clear", description: "Clear skies with comfortable temperatures.", icon: "wb_sunny", wind: "North, 9.3 km/h", image: "/bg.png" },
    { name: "Shanghai", country: "China", region: "Asia", temp: 24, condition: "Overcast", description: "Overcast sky with mild, damp air.", icon: "cloud_queue", wind: "East, 11.0 km/h", image: "/bg.png" },
    { name: "Istanbul", country: "Turkey", region: "Asia", temp: 19, condition: "Partly cloudy", description: "Mild Bosphorus winds with partial cloud cover.", icon: "partly_cloudy_day", wind: "NE, 14.0 km/h", image: "/bg.png" },
    { name: "Kuala Lumpur", country: "Malaysia", region: "Asia", temp: 32, condition: "Tropical rain", description: "Warm tropical rain with lush green surroundings.", icon: "rainy", wind: "West, 5.5 km/h", image: "/bg.png" },
    { name: "Hong Kong", country: "China", region: "Asia", temp: 28, condition: "Humid & warm", description: "Humid harbour air with warm temperatures.", icon: "partly_cloudy_day", wind: "SE, 10.2 km/h", image: "/bg.png" },

    // ── Europe ────────────────────────────────────────────
    { name: "London", country: "United Kingdom", region: "Europe", temp: 12, condition: "Light rain", description: "Gentle drizzle with overcast skies — cozy and grey.", icon: "rainy", wind: "West, 15.0 km/h", image: "/cities/london.png" },
    { name: "Paris", country: "France", region: "Europe", temp: 14, condition: "Foggy", description: "Dense morning fog blanketing the city — misty and romantic.", icon: "foggy", wind: "East, 3.7 km/h", image: "/cities/paris.png" },
    { name: "Berlin", country: "Germany", region: "Europe", temp: 8, condition: "Snowy", description: "Light snowfall covering the streets — quiet winter morning.", icon: "weather_snowy", wind: "North, 11.5 km/h", image: "/cities/berlin.png" },
    { name: "Rome", country: "Italy", region: "Europe", temp: 20, condition: "Sunny", description: "Beautiful Mediterranean sunshine — warm and golden.", icon: "wb_sunny", wind: "South, 7.4 km/h", image: "/bg.png" },
    { name: "Madrid", country: "Spain", region: "Europe", temp: 22, condition: "Clear sky", description: "Bright clear skies with pleasant warmth.", icon: "wb_sunny", wind: "NW, 9.0 km/h", image: "/bg.png" },
    { name: "Amsterdam", country: "Netherlands", region: "Europe", temp: 10, condition: "Cloudy & windy", description: "Gusty winds with thick grey cloud cover.", icon: "cloud", wind: "West, 22.0 km/h", image: "/bg.png" },
    { name: "Moscow", country: "Russia", region: "Europe", temp: -5, condition: "Heavy snow", description: "Thick snowfall blanketing the city — freezing cold.", icon: "weather_snowy", wind: "North, 18.0 km/h", image: "/bg.png" },

    // ── Americas ──────────────────────────────────────────
    { name: "New York", country: "USA", region: "Americas", temp: 18, condition: "Partly cloudy", description: "Scattered clouds with bright patches of sun.", icon: "partly_cloudy_day", wind: "NE, 8.3 km/h", image: "/cities/new-york.png" },
    { name: "Los Angeles", country: "USA", region: "Americas", temp: 26, condition: "Sunny", description: "Classic California sunshine — warm and clear.", icon: "wb_sunny", wind: "West, 10.0 km/h", image: "/bg.png" },
    { name: "Toronto", country: "Canada", region: "Americas", temp: 5, condition: "Cloudy", description: "Cold overcast sky with chilly Ontario winds.", icon: "cloud", wind: "NW, 15.5 km/h", image: "/bg.png" },
    { name: "São Paulo", country: "Brazil", region: "Americas", temp: 30, condition: "Thunderstorm", description: "Heavy rain with lightning — dramatic tropical storm.", icon: "thunderstorm", wind: "SW, 22.0 km/h", image: "/cities/sao-paulo.png" },
    { name: "Mexico City", country: "Mexico", region: "Americas", temp: 23, condition: "Pleasant", description: "Mild highland climate with pleasant temperatures.", icon: "partly_cloudy_day", wind: "East, 6.0 km/h", image: "/bg.png" },

    // ── Africa & Oceania ─────────────────────────────────
    { name: "Sydney", country: "Australia", region: "Oceania", temp: 28, condition: "Sunny", description: "Brilliant sunshine with blue skies — warm and vibrant.", icon: "wb_sunny", wind: "SE, 10.1 km/h", image: "/cities/sydney.png" },
    { name: "Cairo", country: "Egypt", region: "Africa", temp: 36, condition: "Hot & dry", description: "Scorching desert heat with zero clouds.", icon: "wb_sunny", wind: "North, 8.0 km/h", image: "/bg.png" },
    { name: "Cape Town", country: "South Africa", region: "Africa", temp: 22, condition: "Windy & clear", description: "Strong Cape winds with clear blue skies.", icon: "wb_sunny", wind: "SE, 28.0 km/h", image: "/bg.png" },
    { name: "Nairobi", country: "Kenya", region: "Africa", temp: 24, condition: "Mild & cloudy", description: "Comfortable highland weather with light clouds.", icon: "cloud", wind: "East, 9.5 km/h", image: "/bg.png" },
    { name: "Melbourne", country: "Australia", region: "Oceania", temp: 20, condition: "Changeable", description: "Classic Melbourne four-seasons-in-one-day weather.", icon: "partly_cloudy_day", wind: "SW, 18.0 km/h", image: "/bg.png" },
];


// Generate fallback forecast data for N days from today
function generateFallbackForecast(numDays) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const conditions = [
        { condition: "Partly Cloudy", icon: "partly_cloudy_day" },
        { condition: "Mostly Cloudy", icon: "cloud" },
        { condition: "Light Rain", icon: "rainy" },
        { condition: "Sunny", icon: "wb_sunny" },
        { condition: "Clear sky", icon: "wb_sunny" },
        { condition: "Overcast", icon: "cloud_queue" },
        { condition: "Thunderstorm", icon: "thunderstorm" },
    ];
    const result = [];
    for (let i = 1; i <= numDays; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const cond = conditions[i % conditions.length];
        result.push({
            day: days[d.getDay()],
            date: `${months[d.getMonth()]} ${d.getDate()}`,
            condition: cond.condition,
            icon: cond.icon,
            temp: Math.round(22 + Math.sin(i * 0.7) * 8),
        });
    }
    return result;
}

const fallbackForecast7 = generateFallbackForecast(7);
const fallbackForecast14 = generateFallbackForecast(14);


// ─── Weather Icon Mapping ──────────────────────────────

const weatherIconMap = {
    "01d": "wb_sunny", "01n": "dark_mode",
    "02d": "partly_cloudy_day", "02n": "nights_stay",
    "03d": "cloud", "03n": "cloud",
    "04d": "cloud_queue", "04n": "cloud_queue",
    "09d": "rainy", "09n": "rainy",
    "10d": "rainy", "10n": "rainy",
    "11d": "thunderstorm", "11n": "thunderstorm",
    "13d": "weather_snowy", "13n": "weather_snowy",
    "50d": "foggy", "50n": "foggy",
};

function getWeatherIcon(iconCode) {
    return weatherIconMap[iconCode] || "cloud";
}

// ─── Wind Direction Helper ─────────────────────────────

function getWindDirection(deg) {
    const dirs = ["North", "NE", "East", "SE", "South", "SW", "West", "NW"];
    return dirs[Math.round(deg / 45) % 8];
}

// ─── API Fetching ──────────────────────────────────────

// Image cache to avoid re-fetching
const imageCache = new Map();

async function fetchCityImage(cityName) {
    const keys = getApiKeys();
    if (!keys.unsplash) return null;

    const cacheKey = cityName.toLowerCase();
    if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

    try {
        const res = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cityName + " city skyline")}&orientation=landscape&per_page=1&client_id=${keys.unsplash}`
        );
        if (!res.ok) throw new Error(`Unsplash ${res.status}`);
        const data = await res.json();
        const url = data.results?.[0]?.urls?.regular || null;
        if (url) imageCache.set(cacheKey, url);
        return url;
    } catch (err) {
        console.warn("Unsplash fetch failed:", err);
        return null;
    }
}

async function fetchCurrentWeather(cityName) {
    const keys = getApiKeys();
    if (!keys.openWeather) return null;

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${keys.openWeather}&units=metric`
        );
        if (!res.ok) throw new Error(`OWM ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn("OpenWeatherMap current weather failed:", err);
        return null;
    }
}

async function fetchForecast(cityName) {
    const keys = getApiKeys();
    if (!keys.openWeather) return null;

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${keys.openWeather}&units=metric`
        );
        if (!res.ok) throw new Error(`OWM forecast ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn("OpenWeatherMap forecast failed:", err);
        return null;
    }
}

// ─── Open-Meteo API (Free, no key — 16-day forecast) ──

const wmoCodeMap = {
    0: { condition: "Clear sky", icon: "wb_sunny" },
    1: { condition: "Mainly clear", icon: "wb_sunny" },
    2: { condition: "Partly cloudy", icon: "partly_cloudy_day" },
    3: { condition: "Overcast", icon: "cloud_queue" },
    45: { condition: "Foggy", icon: "foggy" },
    48: { condition: "Rime fog", icon: "foggy" },
    51: { condition: "Light drizzle", icon: "rainy" },
    53: { condition: "Drizzle", icon: "rainy" },
    55: { condition: "Heavy drizzle", icon: "rainy" },
    61: { condition: "Light rain", icon: "rainy" },
    63: { condition: "Rain", icon: "rainy" },
    65: { condition: "Heavy rain", icon: "rainy" },
    71: { condition: "Light snow", icon: "weather_snowy" },
    73: { condition: "Snow", icon: "weather_snowy" },
    75: { condition: "Heavy snow", icon: "weather_snowy" },
    77: { condition: "Snow grains", icon: "weather_snowy" },
    80: { condition: "Rain showers", icon: "rainy" },
    81: { condition: "Moderate showers", icon: "rainy" },
    82: { condition: "Heavy showers", icon: "rainy" },
    85: { condition: "Snow showers", icon: "weather_snowy" },
    86: { condition: "Heavy snow showers", icon: "weather_snowy" },
    95: { condition: "Thunderstorm", icon: "thunderstorm" },
    96: { condition: "Thunderstorm with hail", icon: "thunderstorm" },
    99: { condition: "Heavy thunderstorm", icon: "thunderstorm" },
};

async function fetchExtendedForecast(lat, lon) {
    try {
        const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,weathercode&timezone=auto&forecast_days=16`
        );
        if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn("Open-Meteo forecast failed:", err);
        return null;
    }
}

function parseExtendedForecast(data) {
    if (!data?.daily?.time) return [];

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = new Date().toISOString().split("T")[0];

    return data.daily.time
        .map((dateStr, i) => {
            const d = new Date(dateStr + "T12:00:00");
            const code = data.daily.weathercode[i];
            const wmo = wmoCodeMap[code] || { condition: "Unknown", icon: "cloud" };
            return {
                dateStr,
                day: days[d.getDay()],
                date: `${months[d.getMonth()]} ${d.getDate()}`,
                condition: wmo.condition,
                icon: wmo.icon,
                temp: Math.round(data.daily.temperature_2m_max[i]),
            };
        })
        .filter(item => item.dateStr !== today);
}

async function searchCities(query) {
    const keys = getApiKeys();
    if (!keys.openWeather || query.length < 2) return [];

    try {
        const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=6&appid=${keys.openWeather}`
        );
        if (!res.ok) throw new Error(`Geo ${res.status}`);
        const data = await res.json();
        // Deduplicate by name+country
        const seen = new Set();
        return data.filter(c => {
            const key = `${c.name}-${c.country}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    } catch (err) {
        console.warn("Geocoding failed:", err);
        return [];
    }
}

// ─── Parse API Data into App Format ────────────────────

function parseCurrentWeather(data, imageUrl) {
    return {
        name: data.name,
        country: data.sys?.country || "",
        temp: Math.round(data.main.temp),
        condition: data.weather[0]?.description
            ? data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)
            : "Unknown",
        description: buildDescription(data),
        icon: getWeatherIcon(data.weather[0]?.icon || "03d"),
        wind: `${getWindDirection(data.wind?.deg || 0)}, ${(data.wind?.speed * 3.6).toFixed(1)} km/h`,
        image: imageUrl || "/bg.png",
        humidity: data.main?.humidity,
        feelsLike: Math.round(data.main?.feels_like),
        // Extra fields for detail cards
        sunrise: data.sys?.sunrise,
        sunset: data.sys?.sunset,
        visibility: data.visibility, // in meters
        windDeg: data.wind?.deg || 0,
        windSpeed: data.wind?.speed || 0, // m/s
        windGust: data.wind?.gust || 0, // m/s
        pressure: data.main?.pressure,
        clouds: data.clouds?.all,
    };
}

function buildDescription(data) {
    const desc = data.weather[0]?.description || "";
    const temp = Math.round(data.main.temp);
    const humidity = data.main?.humidity;
    if (temp > 30) return `${desc.charAt(0).toUpperCase() + desc.slice(1)} — hot and ${humidity > 70 ? "humid" : "dry"}.`;
    if (temp > 20) return `${desc.charAt(0).toUpperCase() + desc.slice(1)} — warm and pleasant.`;
    if (temp > 10) return `${desc.charAt(0).toUpperCase() + desc.slice(1)} — cool and comfortable.`;
    if (temp > 0) return `${desc.charAt(0).toUpperCase() + desc.slice(1)} — cold and crisp.`;
    return `${desc.charAt(0).toUpperCase() + desc.slice(1)} — freezing temperatures.`;
}

function parseForecast(data) {
    if (!data?.list) return [];

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Group by date, take one entry per day (noon preferred)
    const byDate = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        const hour = parseInt(item.dt_txt.split(" ")[1].split(":")[0]);
        // Prefer noon readings, but take whatever we have
        if (!byDate[date] || Math.abs(hour - 12) < Math.abs(parseInt(byDate[date].dt_txt.split(" ")[1].split(":")[0]) - 12)) {
            byDate[date] = item;
        }
    });

    // Skip today, take up to 5 days
    const today = new Date().toISOString().split("T")[0];
    return Object.entries(byDate)
        .filter(([date]) => date !== today)
        .slice(0, 5)
        .map(([dateStr, item]) => {
            const d = new Date(dateStr);
            return {
                day: days[d.getDay()],
                date: `${months[d.getMonth()]} ${d.getDate()}`,
                condition: item.weather[0]?.description
                    ? item.weather[0].description.charAt(0).toUpperCase() + item.weather[0].description.slice(1)
                    : "Unknown",
                icon: getWeatherIcon(item.weather[0]?.icon || "03d"),
                temp: Math.round(item.main.temp),
            };
        });
}

// ─── DOM Elements ──────────────────────────────────────

const searchInput    = document.getElementById("city-search");
const searchResults  = document.getElementById("search-results");
const forecastList   = document.getElementById("forecast-list");
const forecastTabs   = document.querySelectorAll(".forecast-tab");
const sidebarBtns    = document.querySelectorAll(".sidebar-icon-btn");
const currentTimeEl  = document.getElementById("current-time");
const locationPicker = document.getElementById("location-picker");
const pickerGrid     = document.getElementById("picker-grid");
const pickerOverlay  = document.getElementById("picker-overlay");
const pickerClose    = document.getElementById("picker-close");

// ─── State ─────────────────────────────────────────────

let currentForecast7 = fallbackForecast7;
let currentForecast14 = [];
let activeForecastRange = 7;
let isLoading = false;

// ─── Loading Indicator ─────────────────────────────────

function showLoading() {
    isLoading = true;
    document.getElementById("hero-condition").innerHTML = `<span class="animate-pulse">Loading...</span>`;
}

function hideLoading() {
    isLoading = false;
}

// ─── Sidebar Navigation ───────────────────────────────

sidebarBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        const page = btn.dataset.page;

        sidebarBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Open settings modal when settings icon clicked
        if (page === "settings") {
            openSettings();
        }
    });
});

// ─── City Search (with API) ────────────────────────────

let searchTimeout = null;

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();

    clearTimeout(searchTimeout);

    if (query.length === 0) {
        searchResults.classList.add("hidden");
        searchResults.innerHTML = "";
        return;
    }

    if (!hasApiKeys()) {
        // Fallback to local search
        const matches = fallbackCities.filter(
            c => c.name.toLowerCase().includes(query.toLowerCase()) || c.country.toLowerCase().includes(query.toLowerCase())
        );
        renderSearchResults(matches.map(c => ({ name: c.name, country: c.country, isFallback: true })));
        return;
    }

    // Debounce API calls
    searchTimeout = setTimeout(async () => {
        searchResults.innerHTML = `<div class="px-5 py-4 text-white/40 text-sm text-center animate-pulse">Searching...</div>`;
        searchResults.classList.remove("hidden");

        const results = await searchCities(query);

        if (results.length === 0) {
            searchResults.innerHTML = `<div class="px-5 py-4 text-white/40 text-sm text-center">No cities found</div>`;
            return;
        }

        renderSearchResults(results.map(c => ({
            name: c.name,
            country: c.country || "",
            state: c.state || "",
            isFallback: false,
        })));
    }, 400);
});

function renderSearchResults(results) {
    if (results.length === 0) {
        searchResults.innerHTML = `<div class="px-5 py-4 text-white/40 text-sm text-center">No cities found</div>`;
        searchResults.classList.remove("hidden");
        return;
    }

    searchResults.innerHTML = results.map(r => `
        <div class="search-result-item" data-city="${r.name}" data-country="${r.country || ''}">
            <span class="material-symbols-outlined">location_on</span>
            <span class="city-name">${r.name}</span>
            <span class="city-country">${r.state ? r.state + ", " : ""}${r.country}</span>
        </div>
    `).join("");
    searchResults.classList.remove("hidden");

    searchResults.querySelectorAll(".search-result-item").forEach(item => {
        item.addEventListener("click", async () => {
            const cityName = item.dataset.city;
            searchInput.value = "";
            searchResults.classList.add("hidden");
            searchResults.innerHTML = "";

            if (hasApiKeys()) {
                await loadCityWeather(cityName);
            } else {
                const city = fallbackCities.find(c => c.name === cityName);
                if (city) updateWeatherDisplay(city);
            }
        });
    });
}

document.addEventListener("click", (e) => {
    if (!e.target.closest("#search-container")) {
        searchResults.classList.add("hidden");
    }
});

// ─── Load City Weather from APIs ───────────────────────

async function loadCityWeather(cityName) {
    showLoading();

    // Fetch weather and image in parallel
    const [weatherData, forecastData, imageUrl] = await Promise.all([
        fetchCurrentWeather(cityName),
        fetchForecast(cityName),
        fetchCityImage(cityName),
    ]);

    hideLoading();

    if (!weatherData) {
        // Fall back to local data
        const fallback = fallbackCities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
        if (fallback) {
            updateWeatherDisplay(fallback);
        } else {
            document.getElementById("hero-condition").textContent = "Could not load weather data";
        }
        return;
    }

    const city = parseCurrentWeather(weatherData, imageUrl);
    updateWeatherDisplay(city);

    // Update 5-day forecast from OWM
    if (forecastData) {
        currentForecast7 = parseForecast(forecastData);
    }

    // Fetch extended 16-day forecast from Open-Meteo (free, no key)
    const lat = weatherData.coord?.lat;
    const lon = weatherData.coord?.lon;
    if (lat !== undefined && lon !== undefined) {
        const extendedData = await fetchExtendedForecast(lat, lon);
        if (extendedData) {
            const allDays = parseExtendedForecast(extendedData);
            currentForecast7 = allDays.slice(0, 7);
            currentForecast14 = allDays.slice(0, 14);
        }
    }

    // Render whichever tab is active
    renderForecast(activeForecastRange === 14 ? currentForecast14 : currentForecast7);

    // Activate the first tab
    forecastTabs.forEach(t => {
        t.classList.remove("active", "bg-white/10");
        t.classList.add("text-white/40");
    });
    forecastTabs[0]?.classList.add("active", "bg-white/10");
    forecastTabs[0]?.classList.remove("text-white/40");
    activeForecastRange = 7;
}

// ─── Location Picker Modal ────────────────────────────

function openPicker() {
    pickerOverlay.classList.remove("hidden");
    pickerOverlay.classList.add("flex");
    requestAnimationFrame(() => {
        pickerOverlay.style.opacity = "1";
        locationPicker.style.transform = "scale(1)";
        locationPicker.style.opacity = "1";
    });
}

function closePicker() {
    pickerOverlay.style.opacity = "0";
    locationPicker.style.transform = "scale(0.95)";
    locationPicker.style.opacity = "0";
    setTimeout(() => {
        pickerOverlay.classList.add("hidden");
        pickerOverlay.classList.remove("flex");
    }, 300);
}

pickerClose.addEventListener("click", closePicker);
pickerOverlay.addEventListener("click", (e) => {
    if (e.target === pickerOverlay) closePicker();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closePicker();
        closeSettings();
    }
});

function renderPickerGrid(regionFilter = "All") {
    const filtered = regionFilter === "All"
        ? fallbackCities
        : fallbackCities.filter(c => c.region === regionFilter);

    // Build region tabs
    const regions = ["All", "India", "Asia", "Europe", "Americas", "Africa", "Oceania"];
    const tabsHtml = regions.map(r => {
        const count = r === "All" ? fallbackCities.length : fallbackCities.filter(c => c.region === r).length;
        if (count === 0 && r !== "All") return "";
        const isActive = r === regionFilter;
        return `<button class="picker-region-tab px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isActive ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}" data-region="${r}">${r} <span class="text-white/30">${count}</span></button>`;
    }).join("");

    // Build a search input for the picker too
    const pickerSearch = `
        <div class="relative mb-4">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-lg">search</span>
            <input id="picker-search" class="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-white/20 outline-none transition-all placeholder:text-white/30" placeholder="Filter cities..." type="text" autocomplete="off" />
        </div>
    `;

    // Set filter tabs
    const tabsEl = document.getElementById("picker-tabs");
    if (tabsEl) tabsEl.innerHTML = tabsHtml;

    // Build city cards
    pickerGrid.innerHTML = filtered.map(city => `
        <div class="city-card group cursor-pointer" data-city="${city.name}">
            <div class="relative h-36 rounded-2xl overflow-hidden mb-2">
                <div class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 city-card-bg" data-city-img="${city.name}" style="background-image: url('${city.image}'); background-color: #1a1a2e;"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-3">
                    <div class="flex items-center gap-1 mb-0.5">
                        <span class="material-symbols-outlined text-xs text-white/60">location_on</span>
                        <span class="text-[10px] text-white/50 font-medium">${city.country}</span>
                    </div>
                    <h4 class="text-sm font-bold leading-tight">${city.name}</h4>
                </div>
                <div class="absolute top-2 right-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <span class="material-symbols-outlined text-xs">${city.icon}</span>
                    <span class="text-xs font-bold">${city.temp}°</span>
                </div>
            </div>
        </div>
    `).join("");

    // Attach click handlers
    pickerGrid.querySelectorAll(".city-card").forEach(card => {
        card.addEventListener("click", async () => {
            const cityName = card.dataset.city;
            closePicker();

            if (hasApiKeys()) {
                await loadCityWeather(cityName);
            } else {
                const city = fallbackCities.find(c => c.name === cityName);
                if (city) updateWeatherDisplay(city);
            }
        });
    });

    // Lazy-load Unsplash images for cards that use the default /bg.png
    if (getApiKeys().unsplash) {
        pickerGrid.querySelectorAll(".city-card-bg").forEach(async (el) => {
            const cityName = el.dataset.cityImg;
            const city = fallbackCities.find(c => c.name === cityName);
            if (city && city.image === "/bg.png") {
                const url = await fetchCityImage(cityName);
                if (url) {
                    el.style.backgroundImage = `url('${url}')`;
                    city.image = url; // update in-memory too
                }
            }
        });
    }
}

document.getElementById("open-picker-btn").addEventListener("click", openPicker);
document.getElementById("header-location-btn").addEventListener("click", openPicker);

// Region tab clicks (event delegation since tabs are re-rendered)
document.getElementById("picker-tabs")?.addEventListener("click", (e) => {
    const tab = e.target.closest(".picker-region-tab");
    if (tab) renderPickerGrid(tab.dataset.region);
});

// ─── Settings Modal ───────────────────────────────────

const settingsOverlay = document.getElementById("settings-overlay");
const settingsModal   = document.getElementById("settings-modal");
const settingsClose   = document.getElementById("settings-close");

function openSettings() {
    const keys = getApiKeys();
    document.getElementById("owm-key-input").value = keys.openWeather;
    document.getElementById("unsplash-key-input").value = keys.unsplash;
    updateKeyStatus();

    settingsOverlay.classList.remove("hidden");
    settingsOverlay.classList.add("flex");
    requestAnimationFrame(() => {
        settingsOverlay.style.opacity = "1";
        settingsModal.style.transform = "scale(1)";
        settingsModal.style.opacity = "1";
    });
}

function closeSettings() {
    settingsOverlay.style.opacity = "0";
    settingsModal.style.transform = "scale(0.95)";
    settingsModal.style.opacity = "0";
    setTimeout(() => {
        settingsOverlay.classList.add("hidden");
        settingsOverlay.classList.remove("flex");
    }, 300);
}

function updateKeyStatus() {
    const keys = getApiKeys();
    const owmStatus = document.getElementById("owm-status");
    const unsplashStatus = document.getElementById("unsplash-status");

    owmStatus.textContent = keys.openWeather ? "✓ Configured" : "✗ Not set";
    owmStatus.className = keys.openWeather ? "text-xs font-bold text-emerald-400" : "text-xs font-bold text-red-400";

    unsplashStatus.textContent = keys.unsplash ? "✓ Configured" : "✗ Not set";
    unsplashStatus.className = keys.unsplash ? "text-xs font-bold text-emerald-400" : "text-xs font-bold text-red-400";
}

settingsClose.addEventListener("click", closeSettings);
settingsOverlay.addEventListener("click", (e) => {
    if (e.target === settingsOverlay) closeSettings();
});

document.getElementById("save-keys-btn").addEventListener("click", () => {
    const owmKey = document.getElementById("owm-key-input").value;
    const unsplashKey = document.getElementById("unsplash-key-input").value;
    saveApiKeys(owmKey, unsplashKey);
    updateKeyStatus();

    // Show success feedback
    const btn = document.getElementById("save-keys-btn");
    const original = btn.textContent;
    btn.textContent = "✓ Saved!";
    btn.classList.add("bg-emerald-500/20");
    setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("bg-emerald-500/20");
    }, 1500);

    // Update the API status indicator
    updateApiIndicator();
});

// ─── API Status Indicator ──────────────────────────────

function updateApiIndicator() {
    const indicator = document.getElementById("api-indicator");
    if (!indicator) return;

    if (hasApiKeys()) {
        indicator.innerHTML = `
            <span class="material-symbols-outlined text-base text-emerald-400">cloud_done</span>
            <span class="text-[10px] uppercase tracking-widest text-emerald-400/70 font-bold">Live Data</span>
        `;
    } else {
        indicator.innerHTML = `
            <span class="material-symbols-outlined text-base text-amber-400">cloud_off</span>
            <span class="text-[10px] uppercase tracking-widest text-amber-400/70 font-bold">Demo Mode</span>
        `;
    }
}

function updateWeatherDisplay(city) {
    // Hero card
    document.getElementById("hero-location").textContent = `${city.name}, ${city.country}`;
    document.getElementById("hero-condition").textContent = city.condition;
    document.getElementById("hero-description").textContent = city.description;
    document.getElementById("hero-temp").textContent = `${city.temp}°`;
    document.getElementById("hero-icon").textContent = city.icon;

    // Hero background image (cross-fade)
    const heroBg = document.getElementById("hero-bg");
    heroBg.style.opacity = "0";
    setTimeout(() => {
        heroBg.style.backgroundImage = `url('${city.image}')`;
        heroBg.style.opacity = "1";
    }, 300);

    // Body background
    document.body.style.backgroundImage = `url('${city.image}')`;

    // Header
    document.getElementById("header-location").textContent = `${city.name}, ${city.country.slice(0, 2).toUpperCase()}`;

    // Right panel
    document.getElementById("current-temp").textContent = `${city.temp}°`;
    document.getElementById("current-wind").textContent = city.wind;

    // Extra stats if available
    if (city.humidity !== undefined) {
        const badge = document.getElementById("stats-badge");
        badge.textContent = `💧 ${city.humidity}% humidity`;
    }
    if (city.feelsLike !== undefined) {
        const desc = document.getElementById("hero-description");
        desc.textContent += ` Feels like ${city.feelsLike}°.`;
    }

    // Update detail cards
    updateDetailCards(city);
}

// ─── Weather Detail Cards Update ──────────────────────

function updateDetailCards(city) {
    // ── UV Index (estimated from clouds/time since free API doesn't include UV)
    const uvIndex = estimateUV(city);
    document.getElementById("uv-value").textContent = uvIndex;
    const uvInfo = getUVInfo(uvIndex);
    document.getElementById("uv-level").textContent = uvInfo.level;
    document.getElementById("uv-indicator").style.left = `${Math.min(uvIndex / 11 * 100, 100)}%`;
    document.getElementById("uv-advice").textContent = uvInfo.advice;

    // ── Sunrise & Sunset
    if (city.sunrise && city.sunset) {
        const rise = new Date(city.sunrise * 1000);
        const set = new Date(city.sunset * 1000);
        document.getElementById("sunrise-time").innerHTML = `${formatTime12(rise)}`;
        document.getElementById("sunset-time").textContent = formatTime12(set);

        // Position sun on arc based on current time
        const now = Date.now() / 1000;
        const dayLength = city.sunset - city.sunrise;
        const elapsed = now - city.sunrise;
        const progress = Math.max(0, Math.min(1, elapsed / dayLength));
        // Sun follows quadratic arc: x goes 10→190, y is parabola peaking at 5
        const sunX = 10 + progress * 180;
        const sunY = 55 - Math.sin(progress * Math.PI) * 50;
        const sunEl = document.getElementById("sun-position");
        if (sunEl) {
            sunEl.setAttribute("cx", sunX);
            sunEl.setAttribute("cy", sunY);
        }
    } else {
        // Fallback times
        document.getElementById("sunrise-time").innerHTML = `6:00<span class="text-lg text-white/60">AM</span>`;
        document.getElementById("sunset-time").textContent = "6:00PM";
    }

    // ── Wind Compass
    const windDeg = city.windDeg || 0;
    const windSpeedKmh = city.windSpeed ? Math.round(city.windSpeed * 3.6) : parseWindSpeed(city.wind);
    const gustKmh = city.windGust ? Math.round(city.windGust * 3.6) : Math.round(windSpeedKmh * 1.4);
    document.getElementById("wind-arrow")?.setAttribute("transform", `rotate(${windDeg}, 60, 60)`);
    document.getElementById("wind-speed-val").textContent = windSpeedKmh;
    document.getElementById("wind-gust").innerHTML = `Gusts: <span class="text-white/60 font-semibold">${gustKmh} km/h ${getWindDirection(windDeg)}</span>`;

    // ── Moon Phase (calculated from date)
    const moonPhase = getMoonPhase();
    document.getElementById("moon-phase-name").textContent = moonPhase.name;
    const shadow = document.getElementById("moon-shadow");
    if (shadow) shadow.setAttribute("rx", moonPhase.shadowRx);

    // ── Humidity
    const humidity = city.humidity || 50;
    document.getElementById("humidity-value").innerHTML = `${humidity}<span class="text-2xl text-white/60">%</span>`;
    document.getElementById("humidity-bar").style.width = `${humidity}%`;
    const dewPoint = city.temp ? Math.round(city.temp - (100 - humidity) / 5) : 14;
    document.getElementById("dew-point").textContent = `The dew point is ${dewPoint}° right now.`;

    // ── Visibility
    const visKm = city.visibility ? Math.round(city.visibility / 1000) : 10;
    document.getElementById("visibility-value").innerHTML = `${visKm}<span class="text-lg text-white/60"> km</span>`;
    document.getElementById("visibility-bar").style.width = `${Math.min(visKm / 20 * 100, 100)}%`;
    document.getElementById("visibility-desc").textContent = getVisibilityDesc(visKm);
}

// ─── Detail Card Helpers ──────────────────────────────

function formatTime12(date) {
    let h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m}<span class="text-lg text-white/60">${ampm}</span>`;
}

function estimateUV(city) {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour <= 18;
    if (!isDay) return 0;
    const clouds = city.clouds || 0;
    const base = city.temp > 30 ? 8 : city.temp > 20 ? 5 : city.temp > 10 ? 3 : 1;
    return Math.max(0, Math.round(base * (1 - clouds / 150)));
}

function getUVInfo(uv) {
    if (uv <= 2) return { level: "Low", advice: "No protection needed." };
    if (uv <= 5) return { level: "Moderate", advice: "Use sun protection 9AM–4PM." };
    if (uv <= 7) return { level: "High", advice: "Reduce time in the sun." };
    if (uv <= 10) return { level: "Very High", advice: "Extra protection essential." };
    return { level: "Extreme", advice: "Avoid sun exposure!" };
}

function parseWindSpeed(windStr) {
    const match = windStr?.match(/([\d.]+)\s*km/i);
    return match ? Math.round(parseFloat(match[1])) : 10;
}

function getMoonPhase() {
    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth() + 1, day = now.getDate();
    // Simple moon phase calculation
    const c = Math.floor(365.25 * year) + Math.floor(30.6 * month) + day - 694039.09;
    const phase = (c / 29.5305882) % 1;
    const phases = [
        { name: "New Moon", shadowRx: 40 },
        { name: "Waxing Crescent", shadowRx: 25 },
        { name: "First Quarter", shadowRx: 10 },
        { name: "Waxing Gibbous", shadowRx: -10 },
        { name: "Full Moon", shadowRx: -40 },
        { name: "Waning Gibbous", shadowRx: -10 },
        { name: "Last Quarter", shadowRx: 10 },
        { name: "Waning Crescent", shadowRx: 25 },
    ];
    const idx = Math.round(phase * 8) % 8;
    return phases[idx];
}

function getVisibilityDesc(km) {
    if (km >= 15) return "Perfectly clear view.";
    if (km >= 10) return "Good visibility.";
    if (km >= 5) return "Moderate visibility.";
    if (km >= 2) return "Low visibility — hazy.";
    return "Very poor visibility — fog.";
}

// ─── Forecast Toggle ──────────────────────────────────

forecastTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        forecastTabs.forEach(t => {
            t.classList.remove("active", "bg-white/10");
            t.classList.add("text-white/40");
        });
        tab.classList.add("active", "bg-white/10");
        tab.classList.remove("text-white/40");

        const range = parseInt(tab.dataset.range) || 7;
        activeForecastRange = range;
        renderForecast(range === 14 ? currentForecast14 : currentForecast7);
    });
});

function renderForecast(data) {
    if (!data || data.length === 0) {
        forecastList.innerHTML = `<p class="text-white/40 text-sm text-center py-4">No forecast data available</p>`;
        return;
    }

    forecastList.innerHTML = data.map((item, i) => `
        <div class="forecast-row" style="animation: fade-in 0.4s ease ${i * 0.06}s forwards; opacity: 0; transform: translateY(10px);">
            <div class="flex items-center gap-6">
                <span class="material-symbols-outlined text-3xl text-white/60">${item.icon}</span>
                <div>
                    <p class="font-bold">${item.day}, ${item.date}</p>
                    <p class="text-xs text-white/40 font-bold uppercase tracking-widest">${item.condition}</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div class="w-px h-6 bg-white/10"></div>
                <span class="text-xl font-bold">${item.temp}°</span>
            </div>
        </div>
    `).join("");
}

// ─── Live Clock ────────────────────────────────────────

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    currentTimeEl.textContent = `${hours}:${mins} ${ampm}`;
}

updateClock();
setInterval(updateClock, 30000);

// ─── Update Current Date ──────────────────────────────

function updateDate() {
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    document.getElementById("current-date").textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
}

updateDate();

// ─── Init ──────────────────────────────────────────────

renderForecast(fallbackForecast7);
currentForecast14 = fallbackForecast14;
renderPickerGrid();
updateApiIndicator();

// Show settings on first load if no API keys configured
if (!hasApiKeys()) {
    setTimeout(openSettings, 800);
}
