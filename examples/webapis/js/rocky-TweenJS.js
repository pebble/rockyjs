/*global Rocky:true */

// TODO: this is still WIP

if (typeof (Rocky) === 'undefined') {
  Rocky = {};
}

(function() {
  // micro implementation of TweenJS (will later be an npm Module)
  // http://www.createjs.com/docs/tweenjs/modules/TweenJS.html

  var TweenJS = function(target, props) {
    this.target = target;
    this.props = props;
    this.startTime = new Date().getTime();
  };

  TweenJS.knownTweens = [];
  TweenJS.ensureTweenIsKnownAndActive = function(tween) {
    if (this.knownTweens.indexOf(tween) < 0) {
      this.knownTweens.push(tween);
    }

    this.handleIntervals();
  };

  TweenJS.handleIntervals = function() {
    this.knownTweens = this.knownTweens.filter(function(t) {
      return !t.done;
    });
    var anyTweenActive = this.knownTweens.some(function(t) {
      return t.active;
    });

    if (anyTweenActive) {
      // make sure we're running our interval
      // in the future: use rAF
      if (!this.timerId) {
        this.timerId = setInterval(function() {
          this.handleTick();
        }.bind(this), 1000 / 30);
      }
    } else {
      clearInterval(this.timerId);
      clearTimeout(this.timerId);
      delete this.timerId;

      // activeTweens = []
      // find closest
      // schedule timeout
    }
  };

  var p = TweenJS.prototype;

  p._addStep = function(active) {
    if (active) {
      TweenJS.ensureTweenIsKnownAndActive(this);
    }
  };

  p.wait = function() {
    // todo: implement
    return this;
  };

  p.to = function() {
    // todo: implement
    return this;
  };

  p.call = function() {
    // todo: implement
    return this;
  };

  p.set = function() {
    // todo: implement
    return this;
  };

  Rocky.tween = function() {
    return new TweenJS(arguments);
  };
})();
