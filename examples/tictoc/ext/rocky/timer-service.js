var TimerService = {
  'subscribe': function(granularity, cb) {
    function timer_loop() {
      var date = new Date();
      var dt = {
        hour: date.getHours(),
        min: date.getMinutes(),
        sec: date.getSeconds()
      };
      cb(dt);
    }
    setInterval(timer_loop, 1000);
    timer_loop();
  }
};

export default TimerService;
