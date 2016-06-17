/*eslint no-unused-vars: 0*/
/* global window:true, encodeURIComponent:true, localStorage:true */

var Settings = function(configureUrl, defaultValues) {

  this.configureUrl = configureUrl;
  this.defaultValues = defaultValues;
  this.values = null;

  this.persistKey = 'RockySettings';
  this.jsonString = '';

  this.initialize = function() {

    this.jsonString = this.getUrlParameter('json');
    if (this.jsonString && this.jsonString !== '') {
      // Load configuration from URL
      window.opener.rockySettings.saveConfiguration(this.jsonString);

      window.close();
    } else {
      // Load configuration from localStorage
      this.loadConfiguration();
    }
  };

  this.openConfiguration = function() {
    window.rockySettings = this;
    window.open(this.configureUrl + '?return_to=' +
                encodeURIComponent(window.location.href +
                  '?config=true&json='),
                  'config', 'width=350, height=600');
  };

  this.loadConfiguration = function() {
    this.jsonString = localStorage.getItem(this.persistKey);
    if (this.jsonString && this.jsonString !== '') {
      console.log('loaded: ' + this.jsonString);
      this.values = JSON.parse(this.jsonString);
    } else {
      if (typeof (this.defaultValues) !== 'undefined') {
        this.saveConfiguration(JSON.stringify(this.defaultValues));
      }
    }
  };

  this.saveConfiguration = function(jsonString) {
    this.jsonString = decodeURIComponent(jsonString);
    try {
      this.values = JSON.parse(this.jsonString);
      localStorage.setItem(this.persistKey, JSON.stringify(this.values));
      console.log('saved: ' + this.jsonString);
    } catch (ex) {
      console.log('Failed to parse JSON');
    }
  };

  this.deleteConfiguration = function() {
    localStorage.removeItem(this.persistKey);
  };

  this.getUrlParameter = function(item) {
    var val = window.location.search.match(
                    new RegExp('[\?\&]' + item + '=([^\&]*)(\&?)', 'i')
              );
    return val ? val[1] : val;
  };

  // https://github.com/smallstoneapps/gcolor.js
  this.GColorFromHex = function(hex) {
    var hexNum = parseInt(hex, 16);
    var a = 192;
    var r = (((hexNum >> 16) & 0xFF) >> 6) << 4;
    var g = (((hexNum >> 8) & 0xFF) >> 6) << 2;
    var b = (((hexNum >> 0) & 0xFF) >> 6) << 0;
    return a + r + g + b;
  };

  this.initialize();

};
