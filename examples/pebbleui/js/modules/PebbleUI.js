var PebbleUI = function(rocky, options) {
  options = options || {};

  this.options = options;
  this.windows = [];

  // Load the default font
  this.defaultFont = rocky.fonts_get_system_font(rocky.FONT_KEY_GOTHIC_18);

  this.render = function(ctx, bounds) {
    // short circuit if there's nothing to render
    if (!this.windows || this.windows.length < 1) return;
    
    // otherwise render the active screen
    this.windows[this.windows.length-1].render(ctx, bounds); 
  };

  var parent = this;

  // Everything is an Element!
  this.Element = function(options) {
    options = options || { };

    this.bounds = options.bounds || [0,0,144,168];

    this.backgroundColor = options.backgroundColor || rocky.GColorClear;
    this.color = options.color || rocky.GColorBlack;
    this.z = options.z || 0;

    // Intentionally empty
    this.render = function(ctx, bounds) { };

    this._boundsAreEqual = function(a, b) {
      if(a.length !== b.length) {
        return false;
      }

      for(var i = 0; i < a.length; i++) {
        if(a[i] !== b[i]) {
          return false;
        }
      }

      return true;
    }

    this.animateBounds = function(targetBounds, duration, delay, stoppedCallback) {
      if(this._boundsAreEqual(this.bounds, targetBounds)) {
        return;
      }

      var fps = 30;
      var interval = duration / fps;
      var deltas = [];
      for(var i = 0; i < this.bounds.length; i++) {
        deltas[i] = Math.abs(this.bounds[i] - targetBounds[i]) / interval;
      }

      setTimeout((function() {
        var id = setInterval((function() {
          if(this._boundsAreEqual(this.bounds, targetBounds)) {
            clearInterval(id);

            if(stoppedCallback) {
              stoppedCallback();
            }
          }

          for(var i = 0; i < this.bounds.length; i++) {
            if(Math.abs(this.bounds[i] - targetBounds[i]) < deltas[i]) {
              this.bounds[i] = targetBounds[i];
              continue;
            }

            if(this.bounds[i] < targetBounds[i]) {
              this.bounds[i] += deltas[i];
            } else if(this.bounds[i] > targetBounds[i]) {
              this.bounds[i] -= deltas[i];
            }
          }

          rocky.mark_dirty();
        }).bind(this), interval);
      }).bind(this), delay);
    }

    return this;
  };

  // A Rect is an Element
  this.Rect = function(options) {
    options = options || {};

    var rectElement = new parent.Element(options);
    
    rectElement.render = function(ctx, bounds) {
      rocky.graphics_context_set_fill_color(ctx, this.backgroundColor);
      rocky.graphics_context_set_stroke_color(ctx, this.color);
      rocky.graphics_fill_rect(ctx, this.bounds, 0, rocky.GCornersAll);
    };

    return rectElement;
  };

  // A Circle is an Element
  this.Circle = function(options) {
    options = options || {};

    var circleElement = new parent.Element(options);

    circleElement.render = function(ctx, bounds) {
      rocky.graphics_context_set_fill_color(ctx, this.backgroundColor);
      rocky.graphics_context_set_stroke_color(ctx, rocky.GColorClear);
      rocky.graphics_fill_radial(ctx, this.bounds, rocky.GOvalScaleModeFitCircle, 
                                      Math.min(this.bounds[2], this.bounds[3])/2, 
                                      rocky.DEG_TO_TRIGANGLE(0), rocky.DEG_TO_TRIGANGLE(360));
    };

    return circleElement;
  };

  // A Text is an Element
  this.Text = function(options) {
    options = options || {};

    var textElement = new parent.Element(options);

    textElement.text = options.text || "";
    textElement.font = options.font || parent.defaultFont;
    textElement.color = options.color || rocky.GColorBlack;
    textElement.alignment = options.alignment || rocky.GTextAlignmentLeft;

    textElement.text = options.text || "";

    textElement.render = function(ctx, bounds) {
      rocky.graphics_context_set_text_color(ctx, this.color);
      rocky.graphics_draw_text(ctx, this.text, this.font, this.bounds, 
                                    rocky.GTextOverflowModeWordWrap, 
                                    this.alignment, null);
    };

    return textElement;
  };

  // An Image is an Element
  this.Image = function(options) {
    options = options || {};

    var imageElement = new parent.Element(options);

    imageElement.bitmap = rocky.gbitmap_create(options.url || "");
    imageElement.bitmap.onload = function() { rocky.mark_dirty(); };

    imageElement.render = function(ctx, bounds) {
      rocky.graphics_draw_bitmap_in_rect(ctx, this.bitmap, this.bounds);
    };

    return imageElement;
  };

  // A Window is an Element
  this.Window = function(options) {
    options = options || {};

    var windowElement = new parent.Element(options);
    windowElement.currentZ = 0;

    windowElement.background = new parent.Rect(options);

    windowElement.elements = [];

    windowElement.show = function() {
      var windowIndex = parent.windows.indexOf(windowElement);
      // Remove the window from the stack if it exists
      if (windowIndex >= 0) {
        parent.windows.splice(windowIndex, 1);
      } 
      
      parent.windows.push(windowElement);
      
      setTimeout(rocky.mark_dirty, 0);
    };

    windowElement.hide = function() {
      var windowIndex = parent.windows.indexOf(windowElement);
      // Remove the window from the stack if it exists
      if (windowIndex >= 0) {
        parent.windows.splice(windowIndex, 1);
      }
      
      setTimeout(rocky.mark_dirty, 0);
    };

    windowElement.add = function(el) {
      var elementIndex = windowElement.elements.indexOf(el);
      
      // add a Z-Index if it's not already set
      if (!el.z) el.z = windowElement.currentZ++;

      // Remove the elements from the stack if it exists
      if (elementIndex >= 0) {
        windowElement.elements.splice(windowIndex, 1);
      } 
      
      // Add the element to the list and sort
      windowElement.elements.push(el);
      windowElement.elements = windowElement.elements.sort(function(a,b) { 
        return a.z-b.z; 
      });
      setTimeout(rocky.mark_dirty, 0);
    };

    windowElement.remove = function(el) {
      var elementIndex = windowElement.elements.indexOf(el);
      // Remove the elements from the stack if it exists
      if (elementIndex >= 0) {
        windowElement.elements.splice(windowIndex, 1);
      } 

      setTimeout(rocky.mark_dirty, 0);
    };

    windowElement.render = function(ctx, bounds) {
      windowElement.background.render(ctx, bounds);

      // Render the remainder of the elements
      windowElement.elements.forEach(function(el) {
        if (el.render) el.render(ctx, bounds);
      }.bind(windowElement));
    };

    return windowElement;
  };

  // A Card is ~*not*~ an Element 
  // But it is a Window, (which is an Element)
  this.Card = function(options) {   
    options = options || {};

    var card = new parent.Window(options);

    card.titleElement = new parent.Text({
      bounds: [10,0, 124, 20],
      text: options.title || "",
      color: options.titleColor || rocky.GColorBlack,
      font: options.titleFont || rocky.fonts_get_system_font(rocky.FONT_KEY_GOTHIC_28_BOLD)
    });
    card.subtitleElement = new parent.Text({
      bounds: [10, 30, 124, 20],
      text: options.subtitle || "",
      color: options.subtitleColor || rocky.GColorBlack,
      font: options.subtitleFont || rocky.fonts_get_system_font(rocky.FONT_KEY_GOTHIC_28)
    });
    card.bodyElement = new parent.Text({
      bounds: [10, 60, 124, 108],
      text: options.body || "",
      color: options.bodyColor || rocky.GColorBlack,
      font: options.bodyFont || rocky.fonts_get_system_font(rocky.FONT_KEY_GOTHIC_24_BOLD)
    });

    card.add(card.titleElement);
    card.add(card.subtitleElement);
    card.add(card.bodyElement);
    
    return card;
  };

  rocky.update_proc = this.render.bind(this);
  return this;  
};

