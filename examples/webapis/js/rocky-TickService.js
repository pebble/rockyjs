/*global Rocky:true */

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

if (typeof (Rocky.eventServices) === 'undefined') {
  Rocky.eventServices = [];
}

(function() {
  Rocky.TickService = function(binding) {
    console.log('new service');
    this.lastKnownListeners = [];

    binding.emitter.on('eventlistenerchange', function(emitter) {
      this.schedule(emitter);
    }.bind(this));
  };

  Rocky.TickService.Events = {
    SecondChange: 'secondchange',
    MinuteChange: 'minutechange',
    HourChange: 'hourchange',
    DayChange: 'daychange'
  };

  var segmentSizes = [
    ['secondchange', 1000],
    ['minutechange', 1000 * 60],
    ['hourchange', 1000 * 60 * 60],
    ['daychange', 1000 * 60 * 60 * 24]
  ];

  Rocky.TickService.prototype.eventObject = function(date) {
    var now = date.getTime();
    var result = {date: date};
    for (var i = 0; i < segmentSizes.length; i++) {
      var segment = segmentSizes[i];
      var eventName = segment[0];
      var segmentSize = segment[1];
      var msUntilEndOfSegment = segmentSize - now % segmentSize;
      result[eventName] = msUntilEndOfSegment === 0;
    }

    return result;
  };

  Rocky.TickService.prototype.schedule = function(emitter) {
    var now = new Date();

    // call newly added listeners immediately if they were not marked as "once"
    var newListeners = [];
    for (var k in Rocky.TickService.Events) {
      var eventName = Rocky.TickService.Events[k];
      newListeners = newListeners.concat(emitter.getListeners(eventName));
    }
    var event = this.eventObject(now);
    newListeners.forEach(function(l) {
      if (this.lastKnownListeners.indexOf(l) < 0 && !l.once) {
        l.listener(event);
      }
    }.bind(this));
    this.lastKnownListeners = newListeners;

    // cancel all pending calls before we potentially schedule new calls
    clearTimeout(this.timeoutId);
    delete this.timeoutId;

    // we're iterating from the smaller to the larger segments
    // which is ok (as they are multiples)
    // we fire an event for the smallest segment
    var nowMs = now.getTime();
    for (var i = 0; i < segmentSizes.length; i++) {
      var segment = segmentSizes[i];
      eventName = segment[0];
      if (emitter.getListeners(eventName).length > 0) {
        var segmentSize = segment[1];
        var msUntilEndOfSegment = segmentSize - nowMs % segmentSize;

        // prepare the passed date object to reflect the future date
        var futureDate = new Date(nowMs + msUntilEndOfSegment);
        this.timeoutId = setTimeout(function() {
          emitter.emit(eventName, this.eventObject(futureDate));
          this.schedule(emitter);
        }.bind(this), msUntilEndOfSegment);
        break;
      }
    }
  };

  Rocky.eventServices.push(Rocky.TickService);
})();
