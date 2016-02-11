/*eslint no-unused-vars: 0*/
/* global gbitmap_create:true, XMLHttpRequest:true */

var Weather = function(apiKey) {

  this.apiKey = apiKey;
  this.temperatureCelcius = 0;
  this.iconId = null;
  this.cityName = '';
  this.json = null;
  this.isAvailable = false;
  this.lastUpdated = null;

  var _this = this;

  this.locationOptions = {
    'timeout': 15000,
    'maximumAge': 60000
  };

  this.imageRoot =
      'https://raw.githubusercontent.com/pebble-examples/' +
      'pebblekit-js-weather/master/resources/img/';

  this.images = [
    gbitmap_create(this.imageRoot + 'cloud~color.png'),
    gbitmap_create(this.imageRoot + 'rain~color.png'),
    gbitmap_create(this.imageRoot + 'snow~color.png'),
    gbitmap_create(this.imageRoot + 'sun~color.png')
  ];

  this.icon = function() {
    return this.images[this.iconId];
  };

  this.locationSuccess = function(pos) {
    _this.fetchWeather(pos.coords.latitude, pos.coords.longitude);
  };

  this.locationError = function(err) {
    console.warn('location error (' + err.code + '): ' + err.message);
  };

  this.fetchWeather = function(latitude, longitude) {
    // var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
    var req = new XMLHttpRequest();
    req.open('GET', 'http://api.openweathermap.org/data/2.5/weather?' +
      'lat=' + latitude + '&lon=' + longitude + '&cnt=1&appid=' + this.apiKey, true);
    req.onload = function() {
      if (req.readyState === 4) {
        if (req.status === 200) {
          // console.log(req.responseText);

          _this.json = JSON.parse(req.responseText);
          _this.temperatureCelcius = Math.round(_this.json.main.temp - 273.15);
          _this.iconId = _this.getIconFromWeatherId(_this.json.weather[0].id);
          _this.cityName = _this.weatherJSON.name;

          _this.isAvailable = true;
          _this.lastUpdated = new Date();

        } else {
          _this.isAvailable = false;
        }
      }
    };
    req.send(null);
  };

  this.getIconFromWeatherId = function(weatherId) {
    if (weatherId < 600) {
      return 2;
    } else if (weatherId < 700) {
      return 3;
    } else if (weatherId > 800) {
      return 1;
    } else {
      return 0;
    }
  };

  window.navigator.geolocation.getCurrentPosition(this.locationSuccess,
                                                  this.locationError,
                                                  this.locationOptions);
};
