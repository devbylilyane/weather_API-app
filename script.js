// ⚠️ API key exposée (normal en front, à sécuriser côté backend en production)
const apiKey = "17411bda6b889a3db47a54323741840b";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

// 🔁 fonction pour afficher les données (évite duplication)
function displayWeather(data) {
    const icon = data.weather[0].icon;

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${icon}@2x.png`;

    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temperature").textContent = data.main.temp + "°C";
    document.getElementById("description").textContent = data.weather[0].description;

    document.getElementById("weatherPhrase").textContent =
        `Aujourd’hui : ${data.weather[0].description}`;

    document.getElementById("humidity").textContent =
        "Humidité : " + data.main.humidity + "%";

    document.getElementById("wind").textContent =
        "Vent : " + data.wind.speed + " km/h";
}

// 🔍 Fonction principale
function getWeather(city) {

    const loading = document.getElementById("loading");
    const error = document.getElementById("error");
    const result = document.querySelector(".weather-result");

    // reset affichage
    document.getElementById("cityName").textContent = "";
    document.getElementById("temperature").textContent = "";
    document.getElementById("description").textContent = "";
    document.getElementById("weatherPhrase").textContent = "";
    document.getElementById("humidity").textContent = "";
    document.getElementById("wind").textContent = "";

    // ❌ ville vide
    if (!city) {
        error.textContent = "Entre une ville 😅";
        error.classList.remove("hidden");
        loading.classList.add("hidden");
        result.classList.remove("show");
        return;
    }

    // reset UI
    error.classList.add("hidden");
    loading.classList.remove("hidden");
    result.classList.add("hide");

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`)
        .then(res => res.json())
        .then(data => {

            loading.classList.add("hidden");

            if (data.cod !== 200) {
                error.textContent = "Ville introuvable ❌";
                error.classList.remove("hidden");
                return;
            }

            result.classList.remove("hide");
            result.classList.add("show");

            displayWeather(data);
        })
        .catch(err => {
            loading.classList.add("hidden");
            error.textContent = "Erreur réseau 😬";
            error.classList.remove("hidden");
            console.log(err);
        });
}

// 🖱 clic bouton
searchBtn.addEventListener("click", () => {
    getWeather(cityInput.value);
});

// ⌨️ touche Entrée
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getWeather(cityInput.value);
    }
});

// 🕒 Heure
function updateTime() {
    const now = new Date();

    const time = now.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const date = now.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    document.getElementById("time").textContent = time;
    document.getElementById("date").textContent = date;
}

setInterval(updateTime, 1000);
updateTime();

// 📍 géolocalisation
navigator.geolocation.getCurrentPosition(
    position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`)
            .then(res => res.json())
            .then(data => {
                displayWeather(data);
            });
    },
    () => {
        console.log("Localisation refusée ou indisponible");
    }
);