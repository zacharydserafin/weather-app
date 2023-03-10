var weatherAPIRoot = "https://api.openweathermap.org"
var weatherAPIKey = "65e371b3bec4d135bad559426f0648dc"

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

var searchInput = document.getElementById("form-input");
var searchForm = document.getElementById("search-form");
var todayEl = document.getElementById("today");
var forecastEl = document.getElementById("forecast");
var historyEl = document.getElementById("history");

var history = [];

function renderToday(city, data) {
    var today = dayjs().format("MM-DD-YYYY");
    var temperature = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    var iconURL = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    var iconDescription = data.weather[0].description;

    var todayTitle = document.createElement("h3");
    var card = document.createElement("div");
    var cardContent = document.createElement("div");
    var title = document.createElement("h2");
    var temperatureEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var windSpeedEl = document.createElement("p");
    var weatherIcon = document.createElement("img");

    todayTitle.classList.add("weather-title", "col-12", "pb-2");
    card.setAttribute("class", "card");
    card.classList.add("weather-card");
    cardContent.setAttribute("class", "card-body");
    title.setAttribute("class", "h2 card-title");
    temperatureEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");
    windSpeedEl.setAttribute("class", "card-text");
    weatherIcon.setAttribute("src", iconURL);
    weatherIcon.setAttribute("alt", iconDescription);

    todayTitle.textContent = "Today's Forecast For: " + city;
    title.textContent = "[" + today + "]";
    temperatureEl.textContent = "Temperature: " + temperature + "°F";
    humidityEl.textContent = "Humdidity: " + humidity + "%";
    windSpeedEl.textContent = "Wind Speed: " + windSpeed + "MPH";

    card.appendChild(cardContent);
    title.appendChild(weatherIcon);
    cardContent.appendChild(title);
    cardContent.appendChild(temperatureEl);
    cardContent.appendChild(humidityEl);
    cardContent.appendChild(windSpeedEl);

    todayEl.textContent = "";
    todayEl.appendChild(todayTitle);
    todayEl.appendChild(card);
}

function renderForecastCards(data) {
    var temperature = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    var iconURL = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    var iconDescription = data.weather[0].description;

    var container = document.createElement("div");
    var card = document.createElement("div");
    var cardContent = document.createElement("div");
    var title = document.createElement("h2");
    var temperatureEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var windSpeedEl = document.createElement("p");
    var weatherIcon = document.createElement("img");

    container.setAttribute("class", "col-md");
    card.setAttribute("class", "card");
    card.classList.add("weather-card");
    cardContent.setAttribute("class", "card-body");
    title.setAttribute("class", "h2 card-title");
    temperatureEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");
    windSpeedEl.setAttribute("class", "card-text");
    weatherIcon.setAttribute("src", iconURL);
    weatherIcon.setAttribute("alt", iconDescription);

    title.textContent = "[" + dayjs(data.dt_txt).format("MM-DD-YYYY") + "]";
    temperatureEl.textContent = "Temperature: " + temperature + "°F";
    humidityEl.textContent = "Humdidity: " + humidity + "%";
    windSpeedEl.textContent = "Wind Speed: " + windSpeed + "MPH";

    container.appendChild(card);
    card.appendChild(cardContent);
    title.appendChild(weatherIcon);
    cardContent.appendChild(title);
    cardContent.appendChild(temperatureEl);
    cardContent.appendChild(humidityEl);
    cardContent.appendChild(windSpeedEl);

    forecastEl.appendChild(container);
}

function renderForecast(data, city) {
    var startDate = dayjs().add(1, "day").startOf("day").unix();
    var endDate = dayjs().add(6, "day").startOf("day").unix();
    var titleContainer = document.createElement("div");
    var title = document.createElement("h3");
    titleContainer.setAttribute("class", "col-12");
    titleContainer.classList.add("weather-title");
    title.textContent = "5 Day Forecast For: " + city;

    forecastEl.textContent = "";
    titleContainer.appendChild(title);
    forecastEl.appendChild(titleContainer);

    for (i = 0; i < data.length; i++) {
        if (data[i].dt >= startDate && data[i].dt < endDate) {
            if (data[i].dt_txt.slice(11, 13) == "12") {
                renderForecastCards(data[i]);
            }
        }
    }
}

function renderWeather(city, data) {
    renderToday(city, data.list[0], data.city.timezone);
    renderForecast(data.list, city); 
}

function getWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
    var APILocationURL = weatherAPIRoot + "/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + weatherAPIKey;

    fetch(APILocationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            renderWeather(city, data);
        })
}


function getCoordinates(search) {
    var APICoordURL = weatherAPIRoot + "/geo/1.0/direct?q=" + search + "&limit=5&appid=" + weatherAPIKey;

    fetch(APICoordURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data[0] === null) {
                alert("Location not found");
            } else {
                getWeather(data[0]);
            }
        });
}

function renderHistory() {
    historyEl.textContent = "";
    var history = JSON.parse(localStorage.getItem("search-history")) || [];
    for (var i = history.length - 1; i >= 0; i--) {
        var button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("data-search", history[i]);
        button.classList.add("history-button", "history-btn");
        history[i] = history[i].toUpperCase();
        button.textContent = history[i];
        historyEl.appendChild(button);
    }
}

function updateHistory(data) {
    var history = JSON.parse(localStorage.getItem("search-history")) || [];
    if (history.includes(data)) {
        return;
    }
    history.push(data);
    localStorage.setItem("search-history", JSON.stringify(history));
    renderHistory();
}

function initHistory() {
    var storedHistory = localStorage.getItem("search-history");
    if (storedHistory) {
        history = JSON.parse(storedHistory)
        renderHistory();
    }
    
}

function handleSearch(event) {
    if (!searchInput.value) {
        return;
    }
    event.preventDefault();
    
    var search = searchInput.value.trim();
    getCoordinates(search);
    updateHistory(search);
    searchInput.value = "";
}

function handleHistoryClick(event) {
    if (event.target.matches(".history-button")) {
        var button = event.target;
        var data = button.getAttribute("data-search");
        getCoordinates(data);
    } else {
        return;
    }
}


searchForm.addEventListener("submit", handleSearch)
historyEl.addEventListener("click", handleHistoryClick)
initHistory();