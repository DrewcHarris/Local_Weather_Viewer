$(document).ready(function() {

  var currentTemp;
  var currentHighTemp;
  var currentLowTemp;

//API request to get user's location, longitude, and latitude
  function getLocation() {
    $.ajax({
      url: 'https://ipapi.co/json/'
    ,
      success: function(ipapi_response){
        var city = ipapi_response.city;
        var zip = ipapi_response.postal;
        var state = ipapi_response.region;
        var lon = ipapi_response.longitude;
        var lat = ipapi_response.latitude;
        $('#city').text(city + ", " + state + "'s Current Weather");
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

// Event Handler to show or hide the change location fields
  $('#locationFields').on('hide.bs.collapse', function(){
      $('#showOrHide').text("Change Location");
    });
    $('#locationFields').on('show.bs.collapse', function(){
      $('#showOrHide').text("Hide");
    });

// Event Handler to get user inputted zip code and trigger function to get inputted weather
$('#submit').on('click', function(event) {
  var zipInput = document.getElementById('postal-code').value
  getInputWeather(zipInput);
});

// Event Handler to use enter key to submit
$("#postal-code").keyup(function(event){
    if(event.keyCode == 13){
        $("#submit").click();
    }
});


// Function to get the user's inputted weather
function getInputWeather(zipInput) {
  var appID = "8b5e7df6b6cb9a63f665853c2bff00ee";
  var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipInput + ',us' + '&units=imperial' + '&appid=' + appID;
  console.log(weatherURL);
  getZipLocation(zipInput, weatherURL);

}

//API request to get user's city and state from the inputted zip code
  function getZipLocation(zipInput, weatherURL) {
    $.ajax({
      url: 'http://api.zippopotam.us/us/' + zipInput
    ,
      success: function(zippopotam_response){
        var city = zippopotam_response.places[0]["place name"];
        console.log("City is " + city);
        var state = zippopotam_response.places[0].state;
        console.log("State is " + state);
        $('#city').text(city + ", " + state + "'s Current Weather");
        $('#invalid').text("");
        $('#units').bootstrapToggle('on');
        $('#locationFields').collapse('hide');
        getLocalWeather(weatherURL);

      },
      error: function(request,status,errorThrown) {
        $('#invalid').text("Please enter a valid zip code");
        console.log(request);
        console.log(status);
        console.log(errorThrown);
      }
    });
  }

  getLocation();

});
