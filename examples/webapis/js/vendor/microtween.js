var FRAME_DURATION = 1000 / 30;
// micro implementation of TweenJS (will later be an npm Module)
// http://www.createjs.com/docs/tweenjs/modules/TweenJS.html

var TweenJS = function(target, props) {
  this._target = target;
  this._props = props || {};
  this._startTime = new Date().getTime();
  this._steps = [];
};

TweenJS._reset = function() {
  clearTimeout(this._timeoutId);
  delete this._timeoutId;
  this._knownTweens = [];
  this._referenceTime = new Date().getTime();
};
TweenJS._reset();

TweenJS._handleTween = function(tween) {
  if (this._knownTweens.indexOf(tween) >= 0) {
    // tween is known and will be scheduled in the future,
    // no need to execute anything now
    return;
  }

  var tweenResult = tween._executeWithin(0);
  if (tweenResult) {
    // either true or > 0
    this._knownTweens.push(tween);
    var delay = (typeof tweenResult === 'boolean') ? FRAME_DURATION : tweenResult;
    var now = new Date().getTime();
    var targetedTimeout = now + delay;
    if (!this._referenceTimeout || targetedTimeout < this._referenceTimeout) {
      // make sure we always have a referenceTime
      this._referenceTime = this._referenceTime || now;
      this._referenceTimeout = this._referenceTime || targetedTimeout;
      clearTimeout(this._timeoutId);
      this._timeoutId = setTimeout(this._handleTweens.bind(this), delay);
    }
  }
};

TweenJS._handleTweens = function() {
  var now = new Date().getTime();
  var timePassed = now - this._referenceTime;
  this._referenceTime = now;

  var scheduleDelay = 60 * 1000; // some large number
  // we update all tweens and remove those that are done
  this._knownTweens = this._knownTweens.filter(function(t) {
    var tweenResult = t._executeWithin(timePassed);

    if (typeof tweenResult === 'undefined') {
      // tween is done, we won't keep it and don't need to schedule
      return false;
    }
    if (typeof tweenResult === 'boolean') {
      // tween currently runs an animation
      scheduleDelay = Math.min(scheduleDelay, FRAME_DURATION);
    } else {
      // tween needs to be updated again in some given amount of time
      scheduleDelay = Math.min(scheduleDelay, tweenResult);
    }
    return true;
  });

  // schedule timers appropriate
  clearTimeout(this._timeoutId);
  if (this._knownTweens.length > 0) {
    this._referenceTimeout = scheduleDelay + now;
    this._timeoutId = setTimeout(this._handleTweens.bind(this), scheduleDelay);
  } else {
    delete this._referenceTimeout;
  }
};

TweenJS._getValue = function(target, keyPath) {
  // special case for property paths, e.g. 'a.b.c'
  if (typeof keyPath === 'string') {
    var keyParts = keyPath.split('.');
    while (keyParts.length > 1 && typeof target === 'object') {
      target = target[keyParts.shift()];
    }
    keyPath = keyParts[0];
  }

  if (typeof target !== 'object') {
    return undefined;
  }
  return target[keyPath];
};

TweenJS._getValues = function(target, props) {
  var o = {};
  for (var n in props) {
    o[n] = this._getValue(target, n);
  }
  return o;
};

TweenJS._setValue = function(target, keyPath, value) {
  // special case for property paths, e.g. 'a.b.c'
  if (typeof keyPath === 'string') {
    var keyParts = keyPath.split('.');
    while (keyParts.length > 1 && typeof (target) === 'object') {
      if (target) {
        target = target[keyParts.shift()];
      }
    }
    keyPath = keyParts[0];
  }

  if (typeof (target) === 'object') {
    target[keyPath] = value;
  }
};

TweenJS._setValues = function(target, props) {
  for (var n in props) {
    this._setValue(target, n, props[n]);
  }
};

TweenJS._interpolate = function(from, to, ratio) {
  var typeOfFrom = typeof from;
  var typeOfTo = typeof to;

  if (typeOfFrom === typeOfTo) {
    if (typeOfFrom === 'number') {
      return from * (1 - ratio) + ratio * to;
    }
    if (typeOfFrom === 'object') {
      var result = {};
      var keyObject = ratio < 0.5 ? from : to;
      for (var k in keyObject) {
        result[k] = TweenJS._interpolate(from[k], to[k], ratio);
      }
      return result;
    }
  }

  // any object we cannot interpolate between linearly
  // TODO: support strings that represent values, e.g. color
  //       via some sort of plugin system
  return ratio < 0.5 ? from : to;
};

var p = TweenJS.prototype;

p._addStep = function(s) {
  this._steps.push(s);
  if (TweenJS._knownTweens.indexOf(this) < 0) {
    TweenJS._handleTween(this);
  }
};

p._normalizedDuration = function(duration) {
  return (duration == null || duration <= 0) ? 0 : duration;
};

p._normalizedEasing = function(easing) {
  if (typeof easing === 'function') {
    return easing;
  }
  return TweenJS.Ease[easing] || TweenJS.Ease.linear;
};

// return value is variant
// undefined, if there's no remaining step after duration
// true, if the current step after duration has an update handler
// number milliseconds, when the current step after duration finishes (e.g. wait)
p._executeWithin = function(duration) {
  var currentStepHasUpdateHandler = false;
  var executed = false;
  while (this._steps.length > 0) {
    var s = this._steps[0];
    if (s.setup) {
      s.setup();
      delete s.setup; // ensure we don't call .setup multiple times
      executed = true;
    }

    currentStepHasUpdateHandler = s.update;
    if (currentStepHasUpdateHandler) {
      // s.duration is a valid number > 0 if .update is set
      var relativePosition = (s.originalDuration - s.duration) + duration;
      var clampedPosition = Math.min(s.originalDuration, relativePosition);
      s.update(clampedPosition / s.originalDuration);
      currentStepHasUpdateHandler = true;
      executed = true;
    }

    if (duration < s.duration) {
      // this steps isn't done, yet so we stop looking at future steps
      // and adjust this step so that we treat the passed time correctly next time
      s.duration -= duration;
      break;
    }

    // at this point, the current step is completely finished
    if (s.teardown) {
      s.teardown();
      executed = true;
    }
    this._steps.shift();

    // we use duration to keep track of the 'remaining' duration
    duration -= s.duration;
  }

  if (executed && this._props.onChange) {
    this._props.onChange.call(this);
  }

  if (this._steps.length <= 0) {
    return undefined;
  }
  // at this point s must be the current step
  if (s.update) {
    return true;
  }
  return s.duration;
};

p.wait = function(duration) {
  duration = this._normalizedDuration(duration);
  if (duration <= 0) {
    return this;
  }
  return this._addStep({
    duration: duration
  });
};

p.to = function(props, duration, easing) {
  duration = this._normalizedDuration(duration);
  if (duration === 0) {
    return this.set(props);
  }

  return this._addStep({
    target: this._target,
    duration: duration,
    originalDuration: duration,
    setup: function() {
      this.from = TweenJS._getValues(this.target, props);
      this.to = {};
      for (var k in props) {
        this.to[k] = props[k];
      }
    },
    update: function(position) {
      position = this.easing(position);
      var interpolated = TweenJS._interpolate(this.from, this.to, position);
      TweenJS._setValues(this.target, interpolated);
    },
    easing: this._normalizedEasing(easing)
  });
};

p.call = function(callback, params, scope) {
  scope = scope || this._target;
  return this._addStep({
    duration: 0,
    teardown: function() {
      callback.apply(scope, params);
    }
  });
};

p.set = function(props, target) {
  target = target || this._target;
  return this.call(function() {
    TweenJS._setValues(target, props);
  });
};

TweenJS.tween = function(target, props) {
  return new TweenJS(target, props);
};

// https://gist.github.com/gre/1650294
TweenJS.Ease = {
  // no easing, no acceleration
  linear: function(t) {
    return t;
  },
  // accelerating from zero velocity
  easeInQuad: function(t) {
    return t * t;
  },
  // decelerating to zero velocity
  easeOutQuad: function(t) {
    return t * (2 - t);
  },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  // accelerating from zero velocity
  easeInCubic: function(t) {
    return t * t * t;
  },
  // decelerating to zero velocity
  easeOutCubic: function(t) {
    return (--t) * t * t + 1;
  },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  },
  // accelerating from zero velocity
  easeInQuart: function(t) {
    return t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuart: function(t) {
    return 1 - (--t) * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
  },
  // accelerating from zero velocity
  easeInQuint: function(t) {
    return t * t * t * t * t;
  },
  // decelerating to zero velocity
  easeOutQuint: function(t) {
    return 1 + (--t) * t * t * t * t;
  },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
  }
};

module.exports = TweenJS;
