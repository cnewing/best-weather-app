// A P I  I N F O
let apiKey = "e0d29c8a3a829feac5473c2221352f54";
let apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?q=London&appid=e0d29c8a3a829feac5473c2221352f54";

// D A S H B O A R D  C U S T O M I Z A T I O N

//let name = prompt("What is your first name?");

//name = function insertName() {
//var click = prompt("What is your first name?");
//document.getElementById("greeting").innerHTML = "Welcome," + name;
//};

// V A R I A B L E S
var cities = [];
var citySearch = document.querySelector("#city");
var cityFormEl = document.querySelector("#searchCity");
var cityInputEl = document.querySelector("#city-name");
var weatherEl = document.querySelector("#current-weather");

var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#day-5");
var pastCityButtonEl = document.querySelector("#quick-search-btns");

// D I S P L A Y  C U R R E N T  W E A T H E R
var getCityWeather = function (city) {
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=e0d29c8a3a829feac5473c2221352f54`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, city);
    });
  });
};

var displayWeather = function (weather, searchCity) {
  // C L E A R  P R E V I O U S  S E A R C H
  weatherEl.textContent = "";
  citySearch.textContent = searchCity;

  // C U R R E N T  D A T E
  var currentDate = document.createElement("span");
  currentDate.textContent =
    " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
  $(citySearch).append(currentDate);

  // W E A T H E R  I C O N S
  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  $(citySearch).append(weatherIcon);

  // T E M P E R A T U R E
  var temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
  $(temperatureEl).addClass("list-group-item");

  // H U M I D I T Y
  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
  $(humidityEl).addClass("list-group-item");

  // W I N D  M P H
  var windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  $(windSpeedEl).addClass("list-group-item");

  $(weatherEl).append(temperatureEl);

  $(weatherEl).append(humidityEl);

  $(weatherEl).append(windSpeedEl);

  var lat = weather.coord.lat;
  var lon = weather.coord.lon;
  getUvIndex(lat, lon);
};

var formSumbitHandler = function (event) {
  event.preventDefault();
  var city = cityInputEl.value.trim();
  if (city) {
    getCityWeather(city);
    get5Day(city);
    cities.unshift({ city });
    cityInputEl.value = "";
  } else {
    alert("Please enter a city");
  }
  saveSearch();
  pastSearch(city);
};

// U V  I N D E X
var displayUvIndex = function (index) {
  var uvIndexEl = document.createElement("div");
  uvIndexEl.textContent = "UV Index: ";
  $(uvIndexEl).addClass("list-group-item");

  uvIndexValue = document.createElement("span");
  uvIndexValue.textContent = index.value;

  if (index.value <= 2) {
    $(uvIndexValue).addClass("bg-success text-white");
  } else if (index.value > 2 && index.value <= 8) {
    $(uvIndexValue).addClass("bg-warning text-white");
  } else if (index.value > 8) {
    $(uvIndexValue).addClass("bg-danger text-white");
  }

  $(uvIndexEl).append(uvIndexValue);

  $(weatherEl).append(uvIndexEl);
};
var getUvIndex = function (lat, lon) {
  var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      displayUvIndex(data);
    });
  });
};

// P R E V I O U S  S E A R C H E S
var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};

var pastSearch = function (pastSearch) {
  pastSearchEl = document.createElement("button");
  pastSearchEl.textContent = pastSearch;
  $(pastSearchEl).addClass(
    "d-flex w-100 btn-light border p-2 bg-info text-uppercase"
  );
  pastSearchEl.setAttribute("data-city", pastSearch);
  pastSearchEl.setAttribute("type", "submit");

  pastCityButtonEl.prepend(pastSearchEl);
};

var pastSearchHandler = function (event) {
  var city = event.target.getAttribute("data-city");
  if (city) {
    getCityWeather(city);
  }
};

// 5  D A Y  F O R E C A S T
var get5Day = function (city) {
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      display5Day(data);
    });
  });
};

var display5Day = function (weather) {
  forecastContainerEl.textContent = "";
  forecastTitle.textContent = "5-Day Forecast:";

  var forecast = weather.list;
  for (var i = 5; i < forecast.length; i = i + 8) {
    var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");
    $(forecastEl).addClass("card bg-info text-light m-2");

    // D A T E  E L E M E N T
    var forecastDate = document.createElement("h5");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    $(forecastDate).addClass("card-header text-center");
    $(forecastEl).append(forecastDate);

    //
    var weatherIcon = document.createElement("img");
    $(weatherIcon).addClass("card-body text-center");
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );

    $(forecastEl).append(weatherIcon);

    var forecastTempEl = document.createElement("span");
    $(forecastTempEl).addClass("card-body text-center");
    forecastTempEl.textContent = dailyForecast.main.temp + " °F";

    $(forecastEl).append(forecastTempEl);

    var forecastHumEl = document.createElement("span");
    $(forecastHumEl).addClass("card-body text-center");
    forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

    $(forecastEl).append(forecastHumEl);

    var forecastWindEl = document.createElement("span");
    $(forecastWindEl).addClass("card-body text-center");
    forecastWindEl.textContent = dailyForecast.wind.speed + " MPH";
    console.log(forecastWindEl.textContent);

    $(forecastEl).append(forecastWindEl);

    $(forecastContainerEl).append(forecastEl);
  }
};

// E V E N T  L I S T E N E R S
cityFormEl.addEventListener("submit", formSumbitHandler);
pastCityButtonEl.addEventListener("click", pastSearchHandler);
