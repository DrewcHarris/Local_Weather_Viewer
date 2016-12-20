$(document).ready(function() {

  var currentTemp;
  var currentHighTemp;
  var currentLowTemp;
  var day0HighTemp;
  var day0LowTemp;
  var day1HighTemp;
  var day1LowTemp;
  var day2HighTemp;
  var day2LowTemp;
  var day3HighTemp;
  var day3LowTemp;
  var day4HighTemp;
  var day4LowTemp;


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
    console.log(weatherURL);
    getLocalWeather(weatherURL);
    getFiveDayWeatherURL(lon, lat);
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
        $('#currentDateText').text("Current Conditions");
        $('#currentWeatherText').text(currentWeather);
        var dayWeatherIcon = "currentWeatherIcon";
        matchWeatherIcon(currentWeatherID, currentWeatherIconID, currentWeatherIDPrefix, dayWeatherIcon);
        currentTemp = Math.round(weather_response.main.temp);
        $('#currentTempText').text(currentTemp + " °F");
      },
      error: function(request,status,errorThrown) {
        $('#currentWeatherText').text("Unable to determine your local weather.  Please try again.");
        console.log(request);
        console.log(status);
        console.log(errorThrown);
      }
    });
  }

// Constructs the user's API url to be passed into the openweathermap api for the Five Day Forecast
  function getFiveDayWeatherURL (lon, lat) {
    var appID = "8b5e7df6b6cb9a63f665853c2bff00ee";
    var fiveDayWeatherURL = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + lon + '&cnt=5' + '&units=imperial' + '&appid=' + appID;
    console.log("5 day url: " + fiveDayWeatherURL);
    getFiveDayWeather(fiveDayWeatherURL);
  }

// API request to find the user's local Five Day Weather Forecast using the previously acquired location information
  function getFiveDayWeather(fiveDayWeatherURL) {
    $.ajax({
      url: fiveDayWeatherURL
    ,
      success: function(fiveDayResponse){

        console.log(fiveDayResponse);
        console.log("day 0 description:" + fiveDayResponse.list[0].weather[0].description);
        var day0Date = new Date(fiveDayResponse.list[0].dt * 1000).toDateString();
        $('#day0DateText').text(day0Date);
        var day0WeatherDescription = fiveDayResponse.list[0].weather[0].description;
        $('#day0WeatherText').text(day0WeatherDescription);
        var day0Weather = fiveDayResponse.list[0].weather[0].description;
        var day0WeatherID = fiveDayResponse.list[0].weather[0].id;
        var day0WeatherIDPrefix = day0WeatherID.toString().charAt(0);
        var day0WeatherWeatherIconID = fiveDayResponse.list[0].weather[0].icon;
        day0HighTemp = Math.round(fiveDayResponse.list[0].temp.max);
        day0LowTemp = Math.round(fiveDayResponse.list[0].temp.min);
        var dayWeatherIcon = "day0WeatherIcon";
        matchWeatherIcon(day0WeatherID, day0WeatherWeatherIconID, day0WeatherIDPrefix, dayWeatherIcon);
        $('#day0HighTempText').text("High: " + day0HighTemp + " °F");
        $('#day0LowTempText').text("Low: " + day0LowTemp + " °F");


        console.log("day 1 description:" + fiveDayResponse.list[1].weather[0].description);
        var day1Date = new Date(fiveDayResponse.list[1].dt * 1000).toDateString();
        $('#day1DateText').text(day1Date);
        var day1WeatherDescription = fiveDayResponse.list[1].weather[0].description;
        $('#day1WeatherText').text(day1WeatherDescription);
        var day1Weather = fiveDayResponse.list[1].weather[0].description;
        var day1WeatherID = fiveDayResponse.list[1].weather[0].id;
        var day1WeatherIDPrefix = day1WeatherID.toString().charAt(0);
        var day1WeatherWeatherIconID = fiveDayResponse.list[1].weather[0].icon;
        day1HighTemp = Math.round(fiveDayResponse.list[1].temp.max);
        day1LowTemp = Math.round(fiveDayResponse.list[1].temp.min);
        var day1WeatherIcon = "day1WeatherIcon";
        matchWeatherIcon(day1WeatherID, day1WeatherWeatherIconID, day1WeatherIDPrefix, day1WeatherIcon);
        $('#day1HighTempText').text("High: " + day1HighTemp + " °F");
        $('#day1LowTempText').text("Low: " + day1LowTemp + " °F");


        console.log("day 2 description:" + fiveDayResponse.list[2].weather[0].description);
        var day2Date = new Date(fiveDayResponse.list[2].dt * 1000).toDateString();
        $('#day2DateText').text(day2Date);
        var day2WeatherDescription = fiveDayResponse.list[2].weather[0].description;
        $('#day2WeatherText').text(day2WeatherDescription);
        var day2Weather = fiveDayResponse.list[2].weather[0].description;
        var day2WeatherID = fiveDayResponse.list[2].weather[0].id;
        var day2WeatherIDPrefix = day2WeatherID.toString().charAt(0);
        var day2WeatherWeatherIconID = fiveDayResponse.list[2].weather[0].icon;
        day2HighTemp = Math.round(fiveDayResponse.list[2].temp.max);
        day2LowTemp = Math.round(fiveDayResponse.list[2].temp.min);
        var day2WeatherIcon = "day2WeatherIcon";
        matchWeatherIcon(day2WeatherID, day2WeatherWeatherIconID, day2WeatherIDPrefix, day2WeatherIcon);
        $('#day2HighTempText').text("High: " + day2HighTemp + " °F");
        $('#day2LowTempText').text("Low: " + day2LowTemp + " °F");

        console.log("day 3 description:" + fiveDayResponse.list[3].weather[0].description);
        var day3Date = new Date(fiveDayResponse.list[3].dt * 1000).toDateString();
        $('#day3DateText').text(day3Date);
        var day3WeatherDescription = fiveDayResponse.list[3].weather[0].description;
        $('#day3WeatherText').text(day3WeatherDescription);
        var day3Weather = fiveDayResponse.list[3].weather[0].description;
        var day3WeatherID = fiveDayResponse.list[3].weather[0].id;
        var day3WeatherIDPrefix = day3WeatherID.toString().charAt(0);
        var day3WeatherWeatherIconID = fiveDayResponse.list[3].weather[0].icon;
        day3HighTemp = Math.round(fiveDayResponse.list[3].temp.max);
        day3LowTemp = Math.round(fiveDayResponse.list[3].temp.min);
        var day3WeatherIcon = "day3WeatherIcon";
        matchWeatherIcon(day3WeatherID, day3WeatherWeatherIconID, day3WeatherIDPrefix, day3WeatherIcon);
        $('#day3HighTempText').text("High: " + day3HighTemp + " °F");
        $('#day3LowTempText').text("Low: " + day3LowTemp + " °F");

        console.log("day 4 description:" + fiveDayResponse.list[4].weather[0].description);
        var day4Date = new Date(fiveDayResponse.list[4].dt * 1000).toDateString();
        $('#day4DateText').text(day4Date);
        var day4WeatherDescription = fiveDayResponse.list[4].weather[0].description;
        $('#day4WeatherText').text(day4WeatherDescription);
        var day4Weather = fiveDayResponse.list[4].weather[0].description;
        var day4WeatherID = fiveDayResponse.list[4].weather[0].id;
        var day4WeatherIDPrefix = day4WeatherID.toString().charAt(0);
        var day4WeatherWeatherIconID = fiveDayResponse.list[4].weather[0].icon;
        day4HighTemp = Math.round(fiveDayResponse.list[4].temp.max);
        day4LowTemp = Math.round(fiveDayResponse.list[4].temp.min);
        var day4WeatherIcon = "day4WeatherIcon";
        matchWeatherIcon(day4WeatherID, day4WeatherWeatherIconID, day4WeatherIDPrefix, day4WeatherIcon);
        $('#day4HighTempText').text("High: " + day4HighTemp + " °F");
        $('#day4LowTempText').text("Low: " + day4LowTemp + " °F");


      },
      error: function(request,status,errorThrown) {
        $('#currentWeatherText').text("Unable to determine your 5 day weather forecast.  Please try again.");
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
    console.log("I flipped the units!");
    changeCurrentTemp(currentTemp);
    changeDay0Temp(day0HighTemp, day0LowTemp);
    changeDay1Temp(day1HighTemp, day1LowTemp);
    changeDay2Temp(day2HighTemp, day2LowTemp);
    changeDay3Temp(day3HighTemp, day3LowTemp);
    changeDay4Temp(day4HighTemp, day4LowTemp);
  });

// Function to switch between °F and °C
  function changeCurrentTemp (currentTemp) {
    if ($('#units').prop('checked')){
      $('#currentTempText').text(currentTemp + " °F");
    }
    else {
    currentTemp = Math.round(((currentTemp - 32) * (5/9)));
    $('#currentTempText').text(currentTemp + " °C");
    }
  }

// Function to switch between °F and °C
  function changeDay0Temp (day0HighTemp, day0LowTemp) {
    if ($('#units').prop('checked')){
      $('#day0HighTempText').text("High: " + day0HighTemp + " °F");
      $('#day0LowTempText').text("Low: " + day0LowTemp + " °F");

    }
    else {
      day0HighTemp = Math.round(((day0HighTemp - 32) * (5/9)));
      $('#day0HighTempText').text("High: " + day0HighTemp + " °C");
      day0LowTemp = Math.round(((day0LowTemp - 32) * (5/9)));
      $('#day0LowTempText').text("Low: " + day0LowTemp + " °C");
    }
  }

// Function to switch between °F and °C
  function changeDay1Temp (day1HighTemp, day1LowTemp) {
    if ($('#units').prop('checked')){
      $('#day1HighTempText').text("High: " + day1HighTemp + " °F");
      $('#day1LowTempText').text("Low: " + day1LowTemp + " °F");

    }
    else {
      day1HighTemp = Math.round(((day1HighTemp - 32) * (5/9)));
      $('#day1HighTempText').text("High: " + day1HighTemp + " °C");
      day1LowTemp = Math.round(((day1LowTemp - 32) * (5/9)));
      $('#day1LowTempText').text("Low: " + day1LowTemp + " °C");
    }
  }

// Function to switch between °F and °C
  function changeDay2Temp (day2HighTemp, day2LowTemp) {
    if ($('#units').prop('checked')){
      $('#day2HighTempText').text("High: " + day2HighTemp + " °F");
      $('#day2LowTempText').text("Low: " + day2LowTemp + " °F");

    }
    else {
      day2HighTemp = Math.round(((day2HighTemp - 32) * (5/9)));
      $('#day2HighTempText').text("High: " + day2HighTemp + " °C");
      day2LowTemp = Math.round(((day2LowTemp - 32) * (5/9)));
      $('#day2LowTempText').text("Low: " + day2LowTemp + " °C");
    }
  }

// Function to switch between °F and °C
  function changeDay3Temp (day3HighTemp, day3LowTemp) {
    if ($('#units').prop('checked')){
      $('#day3HighTempText').text("High: " + day3HighTemp + " °F");
      $('#day3LowTempText').text("Low: " + day3LowTemp + " °F");

    }
    else {
      day3HighTemp = Math.round(((day3HighTemp - 32) * (5/9)));
      $('#day3HighTempText').text("High: " + day3HighTemp + " °C");
      day3LowTemp = Math.round(((day3LowTemp - 32) * (5/9)));
      $('#day3LowTempText').text("Low: " + day3LowTemp + " °C");
    }
  }

// Function to switch between °F and °C
  function changeDay4Temp (day4HighTemp, day4LowTemp) {
    if ($('#units').prop('checked')){
      $('#day4HighTempText').text("High: " + day4HighTemp + " °F");
      $('#day4LowTempText').text("Low: " + day4LowTemp + " °F");

    }
    else {
      day4HighTemp = Math.round(((day4HighTemp - 32) * (5/9)));
      $('#day4HighTempText').text("High: " + day4HighTemp + " °C");
      day4LowTemp = Math.round(((day4LowTemp - 32) * (5/9)));
      $('#day4LowTempText').text("Low: " + day4LowTemp + " °C");
    }
  }

// Event Handler to show or hide the change location fields
  $('#locationFields').on('hide.bs.collapse', function(event){
      $('#showOrHide').text("Change Location");
      console.log("I closed the box!");
    });
    $('#locationFields').on('show.bs.collapse', function(event){
      $('#showOrHide').text("Hide");
      console.log("I opened the box!");
    });

// Event Handler to get user inputted zip code and trigger function to get inputted weather
$('#submit').on('click', function(event) {
  var zipInput = document.getElementById('postal-code').value
  getInputWeather(zipInput);
});

// Event Handler to use enter key to submit
$('#postal-code').keyup(function(event){
    if(event.keyCode == 13){
        $('#submit').click();
    }
});


// Function to get the user's inputted weather
function getInputWeather(zipInput) {
  var appID = "8b5e7df6b6cb9a63f665853c2bff00ee";
  var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipInput + ',us' + '&units=imperial' + '&appid=' + appID;
  var fiveDayWeatherURL = 'http://api.openweathermap.org/data/2.5/forecast/daily?zip=' + zipInput + ',us' + '&cnt=5' + '&units=imperial' + '&appid=' + appID;
  console.log("5 day zip url " + fiveDayWeatherURL);
  console.log(weatherURL);
  getZipLocation(zipInput, weatherURL, fiveDayWeatherURL);

}

//API request to get user's city and state from the inputted zip code
  function getZipLocation(zipInput, weatherURL, fiveDayWeatherURL) {
    $.ajax({
      url: 'http://api.zippopotam.us/us/' + zipInput
    ,
      success: function(zippopotam_response){
        var city = zippopotam_response.places[0]["place name"];
        var state = zippopotam_response.places[0].state;
        $('#city').text(city + ", " + state + "'s Current Weather");
        $('#invalid').text("");
        $('#units').bootstrapToggle('on');
        $('#postal-code').val("");
        $('#locationFields').collapse('hide');
        window.scrollTo(0,0);
        getLocalWeather(weatherURL);
        getFiveDayWeather(fiveDayWeatherURL);

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
