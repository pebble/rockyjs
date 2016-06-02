function TickService(listener) {
  this.listener = listener;
}

TickService.Events = {
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

TickService.prototype.eventObject = function(date) {
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

TickService.prototype.schedule = function() {
  var now = new Date();

  var event = this.eventObject(now);
  this.listener(event);

  // we're iterating from the smaller to the larger segments
  // which is ok (as they are multiples)
  // we fire an event for the smallest segment
  var nowMs = now.getTime();
  // HACK! always assumes minute minute change!

  var segment = segmentSizes[1];
  var eventName = segment[0];
  var segmentSize = segment[1];

  var msUntilEndOfSegment = segmentSize - nowMs % segmentSize;

  // prepare the passed date object to reflect the future date
  var futureDate = new Date(nowMs + msUntilEndOfSegment);
  this.timeoutId = setTimeout(function() {
    this.listener(eventName, this.eventObject(futureDate));
    this.schedule();
  }.bind(this), msUntilEndOfSegment);
};

module.exports = TickService;
