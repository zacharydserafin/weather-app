var weatherAPIRoot = "https://api.openweathermap.org"
var weatherAPIKey = "65e371b3bec4d135bad559426f0648dc"

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

var searchInput = document.getElementById("form-input");
var searchForm = document.getElementById("search-form");




function getWeather(location) {
    var { latitude } = location;
    var { longitude } = locatiion;
    var city = location.name;
    var APILocationURL = weatherAPIRoot + "/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + weatherAPIKey;

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

function handleSearch(event) {
    if (searchInput.value === null) {
        return
    }
    event.preventDefault();
    
    var search = searchInput.value.trim();
    getCoordinates(search);
    searchInput.value = "";
}


searchForm.addEventListener("submit", handleSearch)

