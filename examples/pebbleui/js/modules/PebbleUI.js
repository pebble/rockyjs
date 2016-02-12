var PebbleUI = function(rocky, options) {
  options = options || {};

  this.options = options;
  this.windows = [];

  // Load the default font
  this.defaultFont = rocky.fonts_get_system_font(rocky.FONT_KEY_GOTHIC_18);

  this._getTopWindow = function() {
    // short circuit if there's nothing to _render
    if (!this.windows || this.windows.length < 1) return null;
    
    // otherwise _render the active screen
    return this.windows[this.windows.length-1]
  }

  this._render = function(ctx, bounds) {
    var win = this._getTopWindow();
    if (win) win._render(ctx, bounds); 
  };

  var parent = this;

  this.window = window || {};

  this._keys = {};

  this.window.addEventListener('keydown', function(event) {
    var code = event.keyCode;
    var keys = parent._keys;
    var win = parent._getTopWindow();
    if (!win) return;

    if (code < 37 || code > 40) return;   // ignore everything except the arrow keys
    
    if (!keys[code]) {
      keys[code] = { timedown: event.timeStamp };
      win._invokeButtonCallbackByCode(code, { type: "short" });
    }

    if (event.timeStamp - keys[code].timedown > 500 && !keys[code].longPress) {
      keys[code].longPress = true;  // Mark that we've fired the longPress
      win._invokeButtonCallbackByCode(code, { type: "long" });
    }
  });

  this.window.addEventListener('keyup', function(event) {
    var code = event.keyCode;
    var keys = parent._keys;
    
    if (code < 37 || code > 40) return;   // ignore everything except the arrow keys
    
    delete keys[code];
  });


  // Everything is an Element!
  this.Element = function(options) {
    options = options || { };

    this.bounds = options.bounds || [0,0,144,168];

    this.backgroundColor = options.backgroundColor || rocky.GColorClear;
    this.color = options.color || rocky.GColorBlack;
    this.z = options.z || 0;

    // Intentionally empty
    this._render = function(ctx, bounds) { };

    return this;
  };

  // A Rect is an Element
  this.Rect = function(options) {
    options = options || {};

    var rectElement = new parent.Element(options);
    
    rectElement._render = function(ctx, bounds) {
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

    circleElement._render = function(ctx, bounds) {
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

    textElement._render = function(ctx, bounds) {
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
    imageElement.bitmap.onload = function() { setTimeout(rocky.mark_dirty, 0); };

    imageElement._render = function(ctx, bounds) {
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

      return this;
    };

    windowElement.hide = function() {
      var windowIndex = parent.windows.indexOf(windowElement);
      // Remove the window from the stack if it exists
      if (windowIndex >= 0) {
        parent.windows.splice(windowIndex, 1);
      }
      
      setTimeout(rocky.mark_dirty, 0);

      return this;
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

      return this;
    };

    windowElement.remove = function(el) {
      var elementIndex = windowElement.elements.indexOf(el);
      // Remove the elements from the stack if it exists
      if (elementIndex >= 0) {
        windowElement.elements.splice(windowIndex, 1);
      } 

      setTimeout(rocky.mark_dirty, 0);

      return this;
    };

    windowElement._defaultBackHandler = function(event) {
      // Remove the current window
      windowElement.hide();
    }

    windowElement.onUp = function(cb) {
      windowElement.upHandler = cb;

      return this;
    };

    windowElement.onDown = function(cb) {
      windowElement.downHandler = cb;

      return this;
    };

    windowElement.onSelect = function(cb) {
      windowElement.selectHandler = cb;

      return this;
    };

    windowElement.onBack = function(cb) {
      if (cb) windowElement.backHhandler = cb;
      else windowElement.backHandler = windowElement._defaultBackHandler;

      return this;
    };

    windowElement._invokeButtonCallbackByCode = function(code, event) {
      switch (code) {
        case 37:
          if (windowElement.backHandler) windowElement.backHandler(event);
          break;
        case 38:
          if (windowElement.upHandler) windowElement.upHandler(event);
          break;
        case 39:
          if (windowElement.selectHandler) windowElement.selectHandler(event);
          break;
        case 40:
          if (windowElement.downHandler) windowElement.downHandler(event);
          break;
        default:
          console.log("Unknown keycode: " + code);
      }
    };

    windowElement._render = function(ctx, bounds) {
      windowElement.background._render(ctx, bounds);

      // _render the remainder of the elements
      windowElement.elements.forEach(function(el) {
        if (el._render) el._render(ctx, bounds);
      }.bind(windowElement));
    };

    // Set callbacks
    windowElement.backHandler = options.onBack || windowElement._defaultBackHandler;
    windowElement.selectHandler = options.onSelect;
    windowElement.upHandler = options.onUp;
    windowElement.downHandler = options.onDown;

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

    // _ indicates a private method
    var _modifyText = function(el, data) {
      if (typeof data === 'string') {
        el.text = data;
      } else {
        for(var key in data) {
          el[key] = data[key];
        }
      }

      setTimeout(rocky.mark_dirty, 0);
    }

    card.title = function(data) {
      _modifyText(card.titleElement, data);

      return this;
    };

    card.subtitle = function(data) {
      _modifyText(card.subtitleElement, data);

      return this;
    };

    card.body = function(data) {
      _modifyText(card.bodyElement, data);

      return this;
    };
    
    return card;
  };

  rocky.update_proc = this._render.bind(this);
  return this;  
};

