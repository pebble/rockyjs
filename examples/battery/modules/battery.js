var Battery = function() {
  var _this = this;

  if(navigator.getBattery) {
    navigator.getBattery().then(function(battery) {
      _this.setState(battery);
      var eventList = ['chargingchange', 'chargingtimechange', 'dischargingtimechange', 'levelchange'];
      for(var evt in eventList) {
        battery.addEventListener(eventList[evt], function() {
          _this.setState(battery);
        });
      }
    });
  }

  this.isAvailable = false;
  this.charging = false;
  this.level = 0;
  this.dischargingTime = 0;
  this.chargingTime = 0;
};

Battery.prototype.getIsAvailable = function() {
  return this.isAvailable;
};

Battery.prototype.getLevel = function() {
  return this.level;
};

Battery.prototype.getLevelPercent = function() {
  return this.level * 100;
};

Battery.prototype.getCharging = function() {
  return this.charging;
};

Battery.prototype.getChargingTime = function() {
  return this.chargingTime;
};

Battery.prototype.getDischargingTime = function() {
  return this.dischargingTime;
};

Battery.prototype.setState = function(battery) {
  this.isAvailable = true;
  this.charging = battery.charging;
  this.level = battery.level;
  this.dischargingTime = battery.dischargingTime;
  this.chargingTime = battery.chargingTime;
};
