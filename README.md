# Local Weather Viewer

## Introduction

This is one of the projects required for the Front End Certificate at [Free Code Camp](http://freecodecamp.com). I wanted to use a minimalist design to achieve the objective which can be found [here](https://www.freecodecamp.com/challenges/show-the-local-weather), but the user stories include:
* I can see the weather in my current location.
* I can see a different icon or background image (e.g. snowy mountain, hot desert) depending on the weather.
* I can push a button to toggle between Fahrenheit and Celsius.

## Completed Project

![Alt text](https://github.com/DrewcHarris/Local_Weather_Viewer/blob/master/screenshot.png?raw=true)

You can view the fully working project on my [CodePen](http://codepen.io/drewharris/full/BQqxYj/).

## How it Works

I used the api from [ip-api.com](http://ip-api.com/) to obtain the user's location, longitude, and latitude.  I then feed these coordinates into [Open Weather Map's current weather api](https://openweathermap.org/current).  From there, I parse the weather response and get the current weather conditions that are then matched to a corresponding [skycon icon](https://darkskyapp.github.io/skycons/) and displayed.  If the user likes, they can then flip the toggle at the bottom to switch between Celsius and Fahrenheit.

## Future Plans

I would like to get the hourly forecast for the current day as well as the 5 day forecast incorporated into this project.  
