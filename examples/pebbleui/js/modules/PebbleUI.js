var PebbleUI = function(rocky, options) {
  options = options || {};

  this.options = options;
  this.windows = [];
  this.currentZ = 0;
  // Load the default font
  this.defaultFont = rocky.fonts_get_system_font(rocky.FONT_KEY_GOTHIC_18);

  this.render = function(ctx, bounds) {
    // short circuit if there's nothing to render
    if (!this.windows || this.windows.length < 1) return;
    
    // otherwise render the active screen
    this.windows[this.windows.length-1].render(ctx, bounds); 
  };

  var parent = this;

  // Everything is an Element
  this.Element = function(options) {
    options = options || { };

    this.bounds = options.bounds || [0,0,144,168];
    this.z = options.z || parent.currentZ++;

    this.backgroundColor = options.backgroundColor || rocky.GColorClear;
    this.color = options.color || rocky.GColorBlack;

    this.render = null;

    return this;
  };

  // A Rect is an Element
  this.Rect = function(options) {
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

    var card = new Window(options);

    card.titleText = options.title || "";
    car.subtitleText = options.subtitle || "";
    this.bodyText = options.body || "";

    this.titleFont = options.titleFont || rocky.fonts_get_system_font(rocky.FONT_KEY_GOTHIC_28_BOLD);
    this.subtitleFont = options.subtitleFont || rocky.fonts_get_system_font(rocky.FONT_KEY_GOTHIC_28);
    this.bodyFont = options.bodyFont || rocky.fonts_get_system_font(rocky.FONT_KEY_GOTHIC_24_BOLD);



    this.render = function(ctx, bounds) {
      rocky.graphics_draw_text(ctx, this.titleText, this.titleFont, [10, 0, bounds.w-10, 20], 0, 0);
      rocky.graphics_draw_text(ctx, this.subtitleText, this.subtitleFont, [10, 30, bounds.w-10, 50], 0, 0);
      rocky.graphics_draw_text(ctx, this.bodyText, this.bodyFont, [10, 60, bounds.w-10, bounds.h], 0, 0);
    };

    this.show = function() {
    };

    this.hide = function() {
    };
    
    return this;
  };

  rocky.update_proc = this.render.bind(this);
  return this;  
};

