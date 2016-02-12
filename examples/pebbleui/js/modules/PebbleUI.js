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
  this.Element = function(bounds, options) {
    options = options || { };

    this.bounds = bounds;
    this.z = options.z || this.currentZ++;    // z-index

    this.backgroundColor = options.backgroundColor || rocky.GColorClear;
    this.color = options.color || rocky.GColorBlack;

    this.render = null;

    return this;
  };

  // A Rect is an Element
  this.Rect = function(bounds, options) {
    var rect = new parent.Element(bounds, options);
    
    rect.render = function(ctx, bounds) {
      rocky.graphics_context_set_fill_color(ctx, this.backgroundColor);
      rocky.graphics_context_set_stroke_color(ctx, this.color);
      rocky.graphics_fill_rect(ctx, this.bounds, 0, rocky.GCornersAll);
    };

    return rect;
  };

  // A Circle is an Element
  this.Circle = function(bounds, options) {
    var circle = new parent.Element(bounds, options);
    circle.render = function(ctx, bounds) {
      rocky.graphics_context_set_fill_color(ctx, this.backgroundColor);
      rocky.graphics_context_set_stroke_color(ctx, rocky.GColorClear);
      rocky.graphics_fill_radial(ctx, this.bounds, rocky.GOvalScaleModeFitCircle, Math.min(this.bounds[2], this.bounds[3])/2, 
                                  rocky.DEG_TO_TRIGANGLE(0), rocky.DEG_TO_TRIGANGLE(360));
    };

    return circle;
  };

  // A Text is an Element
  this.Text = function(bounds, text, options) {
    options = options || {};

    var t = new parent.Element(bounds, options);
    t.font = options.font || parent.defaultFont;
    t.alignment = options.alignment || rocky.GTextAlignmentLeft;
    t.text = text;

    t.render = function(ctx, bounds) {
      rocky.graphics_context_set_text_color(ctx, t.color);
      rocky.graphics_draw_text(ctx, t.text, t.font, t.bounds, 
                                rocky.GTextOverflowModeWordWrap, 
                                t.alignment, null);
    };

    return t;
  };

  // An Image is an Element
  this.Image = function(url, bounds, options) {
    var image = new parent.Element(bounds, options);
    
    image.bitmap = rocky.gbitmap_create(url);
    image.bitmap.onload = function() { rocky.mark_dirty(); };

    image.render = function(ctx, bounds) {
      rocky.graphics_draw_bitmap_in_rect(ctx, this.bitmap, this.bounds);
    };

    return image;
  };

  // A Window is an Element
  this.Window = function(options) {
    options = options || {};

    this.background = new parent.Rect([0,0,144,168], options);
    this.parent = parent;

    this.elements = [];

    this.show = function() {
      var windowIndex = this.parent.windows.indexOf(this);
      // Remove the window from the stack if it exists
      if (windowIndex >= 0) {
        this.parent.windows.splice(windowIndex, 1);
      } 
      
      this.parent.windows.push(this);
      
      setTimeout(rocky.mark_dirty, 0);
    };

    this.hide = function() {
      var windowIndex = this.parent.windows.indexOf(this);
      // Remove the window from the stack if it exists
      if (windowIndex >= 0) {
        this.parent.windows.splice(windowIndex, 1);
      }
      
      setTimeout(rocky.mark_dirty, 0);
    };

    this.render = function(ctx, bounds) {
      this.background.render(ctx, bounds);

      // Render the remainder of the elements
      this.elements.forEach(function(el) {
        if (el && el.render) el.render(ctx, bounds);
      }.bind(this));
    };

    this.add = function(el) {
      var elementIndex = this.elements.indexOf(el);
      // Remove the elements from the stack if it exists
      if (elementIndex >= 0) {
        this.elements.splice(windowIndex, 1);
      } 
      
      // Add the element to the list and sort
      this.elements.push(el);
      this.elements = this.elements.sort(function(a,b) { return a-b; });
      setTimeout(rocky.mark_dirty, 0);
    };

    this.remove = function(el) {
      var elementIndex = this.elements.indexOf(el);
      // Remove the elements from the stack if it exists
      if (elementIndex >= 0) {
        this.elements.splice(windowIndex, 1);
      } 

      setTimeout(rocky.mark_dirty, 0);
    };

    return this;
  };

  // A Card is ~*not*~ an Element 
  // But it is a Window, (which is an Element)
  this.Card = function(options) {   
    options = options || {};

    this.parent = parent;
    
    this.titleText = options.title || "";
    this.subtitleText = options.subtitle || "";
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

    this.on = function(event, callback) {
      
    };
    
    return this;
  };

  rocky.update_proc = this.render.bind(this);
  return this;  
};

