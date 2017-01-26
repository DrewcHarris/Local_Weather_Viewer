$(document).ready(function() {

  var currentTemp;

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
        console.log("ipapi response: " + "https://ipapi.co/json/");
        $('#city').text("Current Weather in " + city + ", " + state);
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
    console.log("Current Weather URL " + weatherURL);
    getLocalWeather(weatherURL);
    getFiveDayWeatherURL(lon, lat);
  }

// API request to find the user's local weather using the previously acquired location information
  function getLocalWeather(weatherURL) {
    $.ajax({
      url: weatherURL
    ,
      success: function(weather_response){
        var unit = "F";
        var currentWeather = weather_response.weather[0].description;
        var currentWeatherID = weather_response.weather[0].id;
        var currentWeatherIDPrefix = currentWeatherID.toString().charAt(0);
        var currentWeatherIconID = weather_response.weather[0].icon;
        $('#currentDateText').text("Current Conditions");
        $('#currentWeatherText').text(currentWeather);
        var day = "currentWeatherPane";
        matchWeatherIcon(currentWeatherID, currentWeatherIconID, currentWeatherIDPrefix, day);
        currentTemp = Math.round(weather_response.main.temp);
        $('#currentTempText').text(currentTemp + " °" + unit);
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
      for (i = 0; i < fiveDayResponse.list.length; i++) {
        //string build div id
        var day = "day"+ i;
        var unit = "F";
        //Get and set readable date
        var readableDate = new Date(fiveDayResponse.list[i].dt * 1000).toDateString();
        $('#'+ day + ' .DateText').text(readableDate);
        updateWeatherText(fiveDayResponse,day, unit);
      }
    },
    error: function(request,status,errorThrown) {
      $('#currentWeatherText').text("Unable to determine your 5 day weather forecast.  Please try again.");
      console.log(request);
      console.log(status);
      console.log(errorThrown);
    }
  });
}

function updateWeatherText(fiveDayResponse, day, unit) {
  //Get and set each day's weather description
  var weatherDescription = fiveDayResponse.list[i].weather[0].description;
  $('#'+ day + ' .WeatherText').text(weatherDescription);
  //Get and set information for skycons to be matched against the weather conditions
  var weatherID = fiveDayResponse.list[i].weather[0].id
  var weatherIDPrefix = weatherID.toString().charAt(0);
  var weatherIconID =  fiveDayResponse.list[i].weather[0].icon;
  matchWeatherIcon(weatherID, weatherIconID, weatherIDPrefix, day);
  //Get and set each day's high & low temp
  var highTemp = Math.round(fiveDayResponse.list[i].temp.max);
  var lowTemp = Math.round(fiveDayResponse.list[i].temp.min);
  storeTempData(day, highTemp, lowTemp, unit);
  displayConvertedTemp(day, highTemp, lowTemp, unit);
}


// If / Switch chain to match Weather API Reponse to corresponding Skycon icons
  function matchWeatherIcon (WeatherID, WeatherIconID, WeatherIDPrefix, day) {
    var icons = new Skycons({"color": "black"});
    var iconCanvas = $('#' + day + ' .WeatherIcon')[0];
    icons.play();

    if (WeatherID === 611 || WeatherID === 612 ) {
      icons.set(WeatherIcon, Skycons.SLEET);
    }
    else if (WeatherIconID) {
      switch (WeatherIconID) {
        case "01d":
          icons.set(iconCanvas, Skycons.CLEAR_DAY);
          break;
        case "01n":
          icons.set(iconCanvas, Skycons.CLEAR_NIGHT);
          break;
        case "02d":
          icons.set(iconCanvas, Skycons.PARTLY_CLOUDY_DAY);
          break;
        case "02n":
          icons.set(iconCanvas, Skycons.PARTLY_CLOUDY_NIGHT);
          break;
        case "03d":
        case "03n":
        case "04d":
        case "04n":
          icons.set(iconCanvas, Skycons.CLOUDY);
          break;
        case "09d":
        case "09n":
        case "10d":
        case "10n":
        case "11d":
        case "11n":
          icons.set(iconCanvas, Skycons.RAIN);
          break;
        case "13d":
        case "13n":
          icons.set(iconCanvas, Skycons.SNOW);
          break;
        case "50d":
        case "50n":
          icons.set(iconCanvas, Skycons.FOG);
          break;
      }
    }
    else {
      switch (WeatherIDPrefix) {
        case "9":
          icons.set(iconCanvas, Skycons.WIND);
          break;
        }
    }
  }

// Event handler to change temp if toggle is selected
  $('#units').on('change', function(event) {
    toggleUnits();
  });

// Function to switch between °F and °C
  function toggleUnits (day, highTemp, lowTemp, unit) {
    if ($('#units').prop('checked')){
      for (i = 0; i < 5; i++) {
        var day = "day"+ i;
        var unit = "F"
        var highTemp = Math.round(($('#'+ day + ' .HighTempText').data("data-high")));
        var lowTemp = Math.round(($('#'+ day + ' .LowTempText').data("data-low")));
        displayConvertedTemp(day, highTemp, lowTemp, unit);
      }
      changeCurrentTemp(currentTemp);
    }
    else {
      for (i = 0; i < 5; i++) {
        var day = "day"+ i;
        var unit = "C"
        var highTemp = Math.round(($('#'+ day + ' .HighTempText').data("data-high") - 32) * (5/9));
        var lowTemp = Math.round(($('#'+ day + ' .LowTempText').data("data-low") - 32) * (5/9));
        displayConvertedTemp(day, highTemp, lowTemp, unit);
      }
      changeCurrentTemp(currentTemp);
    }
  }

  function changeCurrentTemp (currentTemp) {
   if ($('#units').prop('checked')){
     $('#currentTempText').text(currentTemp + " °F");
   }
   else {
     currentTemp = Math.round(((currentTemp - 32) * (5/9)));
     $('#currentTempText').text(currentTemp + " °C");
   }
 }

function displayConvertedTemp (day, highTemp, lowTemp, unit) {
  $('#'+ day + ' .HighTempText').text("High: " + highTemp + " °" + unit);
  $('#'+ day + ' .LowTempText').text("Low: " + lowTemp + " °" + unit);
}

function storeTempData (day, highTemp, lowTemp, unit) {
  $('#'+ day + ' .HighTempText').data("data-high", highTemp);
  $('#'+ day + ' .LowTempText').data("data-low", lowTemp);
}


// Event Handler to show or hide the change location fields
  $('#locationFields').on('hide.bs.collapse', function(event){
      $('#showOrHide').text("Change Location");
    });
    $('#locationFields').on('show.bs.collapse', function(event){
      $('#showOrHide').text("Hide");
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
        $('#city').text("Current Weather in " + city + ", " + state);
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
