$(document).ready(function() {

  var currentTemp;
  var currentHighTemp;
  var currentLowTemp;

//API request to get user's location, longitude, and latitude
  function getLocation() {
    $.ajax({
      url: 'http://ip-api.com/json'
    ,
      success: function(ipapi_response){
        var city = ipapi_response.city;
        var state = ipapi_response.regionName;
        var lon = ipapi_response.lon;
        var lat = ipapi_response.lat;
        var ip = ipapi_response.query;
        $('#city').text(city + ", " + state + "'s Current Weather");
        $('#lon').append(lon);
        $('#lat').append(lat);
        $('#ip').append(ip);
        getWeatherURL(city, lon, lat);
      },
      error: function(request,status,errorThrown) {
        $('#city').text("Unable to determine your location.  Please try again.");
        console.log(request);
        console.log(status);
        console.log(errorThrown);
      }
    });
  }

// Constructs the user's API url to be passed into the openweathermap api
  function getWeatherURL (city, lon, lat) {
    var appID = "8b5e7df6b6cb9a63f665853c2bff00ee";
    var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=imperial' + '&appid=' + appID;
    getLocalWeather(weatherURL);
  }

// API request to find the user's local weather using the previously acquired location information
  function getLocalWeather(weatherURL) {
    $.ajax({
      url: weatherURL
    ,
      success: function(weather_response){
        var currentWeather = weather_response.weather[0].description;
        var currentWeatherID = weather_response.weather[0].id;
        var currentWeatherIDPrefix = currentWeatherID.toString().charAt(0);
        var currentWeatherIconID = weather_response.weather[0].icon;
        $('#currentWeatherText').text(currentWeather);
        var dayWeatherIcon = "currentWeatherIcon";
        matchWeatherIcon(currentWeatherID, currentWeatherIconID, currentWeatherIDPrefix, dayWeatherIcon);
        currentTemp = Math.round(weather_response.main.temp);
        $('#currentTempText').text("Current: " + currentTemp + " °F");
        currentHighTemp = Math.round(weather_response.main.temp_max);
        $('#currentHighTempText').text("High: " + currentHighTemp + " °F");
        currentLowTemp = Math.round(weather_response.main.temp_min);
        $('#currentLowTempText').text("Low: " + currentLowTemp + " °F");
      },
      error: function(request,status,errorThrown) {
        $('#currentWeatherText').text("Unable to determine your local weather.  Please try again.");
        console.log(request);
        console.log(status);
        console.log(errorThrown);
      }
    });
  }

// If / Switch chain to match Weather API Reponse to corresponding Skycon icons
  function matchWeatherIcon (WeatherID, WeatherIconID, WeatherIDPrefix, dayWeatherIcon) {
    var icons = new Skycons({"color": "black"});
      icons.set("day0WeatherIcon", Skycons.CLEAR_DAY);
      icons.set("day1WeatherIcon", Skycons.CLEAR_DAY);
      icons.set("day2WeatherIcon", Skycons.CLEAR_DAY);
      icons.set("day3WeatherIcon", Skycons.CLEAR_DAY);
      icons.set("day4WeatherIcon", Skycons.CLEAR_DAY);
    icons.play();

    if (WeatherID === 611 || WeatherID === 612 ) {
      icons.set(dayWeatherIcon, Skycons.SLEET);
    }
    else if (WeatherIconID) {
      switch (WeatherIconID) {
        case "01d":
          icons.set(dayWeatherIcon, Skycons.CLEAR_DAY);
          break;
        case "01n":
          icons.set(dayWeatherIcon, Skycons.CLEAR_NIGHT);
          break;
        case "02d":
          icons.set(dayWeatherIcon, Skycons.PARTLY_CLOUDY_DAY);
          break;
        case "02n":
          icons.set(dayWeatherIcon, Skycons.PARTLY_CLOUDY_NIGHT);
          break;
        case "03d":
        case "03n":
        case "04d":
        case "04n":
          icons.set(dayWeatherIcon, Skycons.CLOUDY);
          break;
        case "09d":
        case "09n":
        case "10d":
        case "10n":
        case "11d":
        case "11n":
          icons.set(dayWeatherIcon, Skycons.RAIN);
          break;
        case "13d":
        case "13n":
          icons.set(dayWeatherIcon, Skycons.SNOW);
          break;
        case "50d":
        case "50n":
          icons.set(dayWeatherIcon, Skycons.FOG);
          break;
      }
    }
    else {
      switch (WeatherIDPrefix) {
        case "9":
          icons.set(dayWeatherIcon, Skycons.WIND);
          break;
        }
    }
  }

// Event handler to change temp if toggle is selected
  $('#units').on('change', function(event) {
    changeTemp(currentTemp, currentHighTemp, currentLowTemp);
  });

// Function to switch between °F and °C
  function changeTemp (currentTemp, currentHighTemp, currentLowTemp) {
    if ($('#units').prop("checked")){
      $('#currentTempText').text("Current: " + currentTemp + " °F");
      $('#currentHighTempText').text("High: " + currentHighTemp + " °F");
      $('#currentLowTempText').text("Low: " + currentLowTemp + " °F");
    }
    else {
    currentTemp = Math.round(((currentTemp - 32) * (5/9)));
    $('#currentTempText').text("Current: " + currentTemp + " °C");
    currentHighTemp = Math.round(((currentHighTemp - 32) * (5/9)));
    $('#currentHighTempText').text("High: " + currentHighTemp + " °C");
    currentLowTemp = Math.round(((currentLowTemp - 32) * (5/9)));
    $('#currentLowTempText').text("Low: " + currentLowTemp + " °C");
    }

  }

  getLocation();

});
