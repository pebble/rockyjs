var PebbleUI = function(rocky, options) {
  options = options || {};

  this._windows = [];

  // Load the default font
  this._defaultFont = options.defaultFont || rocky.FONT_KEY_GOTHIC_18;

  this._getTopWindow = function() {
    // short circuit if there's nothing to _render
    if (!this._windows || this._windows.length < 1) return null;

    // otherwise _render the active screen
    return this._windows[this._windows.length - 1];
  };

  this._dirty = false;

  this.mark_dirty = function() {
    // don't do anything if it's already marked dirty
    if (this._dirty === true) return;

    // Otherwise, render when possible
    this._dirty = true;
    setTimeout(function() {
      rocky.mark_dirty();
      this._dirty = false;
    }.bind(this), 0);
  };

  this._render = function(ctx, bounds) {
    var win = this._getTopWindow();
    if (win) win._render(ctx, bounds);
  };

  var parent = this;

  this._window = window || {};
  this._keys = {};

  this._window.addEventListener('keydown', function(event) {
    var code = event.keyCode;
    var keys = parent._keys;
    var win = parent._getTopWindow();
    if (!win) return;

    if (code < 37 || code > 40) return;   // ignore everything except the arrow keys
    event.preventDefault();

    if (!keys[code]) {
      keys[code] = { timedown: event.timeStamp };
      win._invokeButtonCallbackByCode(code, { type: 'short' });
    }

    if (event.timeStamp - keys[code].timedown > 500 && !keys[code].longPress) {
      keys[code].longPress = true;  // Mark that we've fired the longPress
      win._invokeButtonCallbackByCode(code, { type: 'long' });
    }
  });

  this._window.addEventListener('keyup', function(event) {
    var code = event.keyCode;
    var keys = parent._keys;

    if (code < 37 || code > 40) return;   // ignore everything except the arrow keys

    delete keys[code];
  });

  // Everything is an Element!
  this.Element = function(options) {
    this.options = options || { };

    this.bounds = this.options.bounds || [0, 0, 144, 168];
    this._backgroundColor = options.backgroundColor || rocky.GColorClear;
    this._color = options.color || rocky.GColorBlack;
    this.z = options.z || 0;

    // Intentionally empty
    this._render = function(ctx, bounds) { };

    return this;
  };

  // A Line is an Element
  this.Line = function(options) {
    options = options || {};

    var lineElement = new parent.Element(options);
    lineElement._p1 = [options.bounds[0], options.bounds[1]];
    lineElement._p2 = [
      options.bounds[0] + options.bounds[2],
      options.bounds[1] + options.bounds[3]
    ];
    lineElement._strokeWidth = options.width || 2;

    lineElement._render = function(ctx, bounds) {
      rocky.graphics_context_set_stroke_color(ctx, this._color);
      rocky.graphics_context_set_stroke_width(ctx, this._strokeWidth);
      rocky.graphics_draw_line(ctx, this._p1, this._p2);
    };

    return lineElement;
  };

  // A Rect is an Element
  this.Rect = function(options) {
    options = options || {};

    var rectElement = new parent.Element(options);

    rectElement._render = function(ctx, bounds) {
      rocky.graphics_context_set_fill_color(ctx, this._backgroundColor);
      rocky.graphics_context_set_stroke_color(ctx, this._color);
      rocky.graphics_fill_rect(ctx, this.bounds, 0, rocky.GCornersAll);
    };

    return rectElement;
  };

  // A Circle is an Element
  this.Circle = function(options) {
    options = options || {};

    var circleElement = new parent.Element(options);
    circleElement._render = function(ctx, bounds) {
      rocky.graphics_context_set_fill_color(ctx, this._backgroundColor);
      rocky.graphics_context_set_stroke_color(ctx, rocky.GColorClear);
      rocky.graphics_fill_radial(ctx, this.bounds, rocky.GOvalScaleModeFitCircle,
                                Math.min(this.bounds[2], this.bounds[3]) / 2,
                                0, rocky.DEG_TO_TRIGANGLE(360));
    };

    return circleElement;
  };

  // A Text is an Element
  this.Text = function(options) {
    options = options || {};

    var textElement = new parent.Element(options);

    textElement._text = options.text || '';
    textElement._font = rocky.fonts_get_system_font(options.font) ||
                        rocky.fonts_get_system_font(parent._defaultFont);
    textElement._color = options.color || rocky.GColorBlack;
    textElement._alignment = options.alignment || rocky.GTextAlignmentLeft;

    textElement.set = function(data) {
      if (typeof data === 'string') {
        this._text = data;
      } else {
        for (var key in data) {
          this._text[key] = data[key];
        }
      }

      parent.mark_dirty();
    };

    textElement._render = function(ctx, bounds) {
      rocky.graphics_context_set_text_color(ctx, this._color);
      rocky.graphics_draw_text(ctx, this._text, this._font, this.bounds,
                                    rocky.GTextOverflowModeWordWrap,
                                    this._alignment, null);
    };

    return textElement;
  };

  // An Image is an Element
  this.Image = function(options) {
    options = options || {};

    var imageElement = new parent.Element(options);

    imageElement._bitmap = rocky.gbitmap_create(options.url || '');
    imageElement._bitmap.onload = function() { parent.mark_dirty(); };

    imageElement._render = function(ctx, bounds) {
      rocky.graphics_draw_bitmap_in_rect(ctx, this._bitmap, this.bounds);
    };

    return imageElement;
  };

  // A Window is an Element
  this.Window = function(options) {
    options = options || {};

    var windowElement = new parent.Element(options);

    windowElement._currentZ = 0;
    windowElement._background = new parent.Rect(options);
    windowElement._elements = [];

    windowElement.show = function() {
      var windowIndex = parent._windows.indexOf(this);
        // Remove the window from the stack if it exists
      if (windowIndex >= 0) {
        parent._windows.splice(windowIndex, 1);
      }

      parent._windows.push(this);
      parent.mark_dirty();
      return this;
    };

    windowElement.hide = function() {
      var windowIndex = parent._windows.indexOf(this);
      // Remove the window from the stack if it exists
      if (windowIndex >= 0) {
        parent._windows.splice(windowIndex, 1);
      }

      parent.mark_dirty();
      return this;
    };

    windowElement.add = function(el) {
      var elementIndex = this._elements.indexOf(el);

      // add a Z-Index if it's not already set
      if (!el.z) el.z = this._currentZ++;

      // Remove the elements from the stack if it exists
      if (elementIndex >= 0) {
        this._elements.splice(elementIndex, 1);
      }

      // Add the element to the list and sort
      this._elements.push(el);
      this._elements = this._elements.sort(function(a, b) {
        return a.z - b.z;
      });

      parent.mark_dirty();
      return this;
    };

    windowElement.remove = function(el) {
      var elementIndex = this._elements.indexOf(el);
      // Remove the elements from the stack if it exists
      if (elementIndex >= 0) {
        this._elements.splice(elementIndex, 1);
      }

      parent.mark_dirty();
      return this;
    };

    windowElement._defaultBackHandler = function(event) {
      // Remove the current window
      this.hide();
    };

    windowElement.onUp = function(cb) {
      this._upHandler = cb;
      return this;
    };

    windowElement.onDown = function(cb) {
      this._downHandler = cb;
      return this;
    };

    windowElement.onSelect = function(cb) {
      this._selectHandler = cb;
      return this;
    };

    windowElement.onBack = function(cb) {
      if (cb) this._backHandler = cb;
      else this._backHandler = this._defaultBackHandler;
      return this;
    };

    windowElement._invokeButtonCallbackByCode = function(code, event) {
      switch (code) {
        case 37:
          if (this._backHandler) this._backHandler(event);
          break;
        case 38:
          if (this._upHandler) this._upHandler(event);
          break;
        case 39:
          if (this._selectHandler) this._selectHandler(event);
          break;
        case 40:
          if (this._downHandler) this._downHandler(event);
          break;
        default:
          console.log('Unknown keycode: ' + code);
      }
    };

    // Set callbacks
    windowElement._backHandler = options.onBack || windowElement._defaultBackHandler;
    windowElement._selectHandler = options.onSelect;
    windowElement._upHandler = options.onUp;
    windowElement._downHandler = options.onDown;

    windowElement._render = function(ctx, bounds) {
      this._background._render(ctx, bounds);

      // _render the remainder of the elements
      this._elements.forEach(function(el) {
        if (el._render) el._render(ctx, bounds);
      });
    };

    return windowElement;
  };

  // A Card is not an Element
  // But it is a Window (which is an Element)
  this.Card = function(options) {
    options = options || {};

    var card = new parent.Window(options);

    card._title = new parent.Text({
      bounds: [10, 0, 124, 20],
      text: options.title || '',
      color: options.titleColor || rocky.GColorBlack,
      font: options.titleFont || rocky.FONT_KEY_GOTHIC_24_BOLD
    });
    card._subtitle = new parent.Text({
      bounds: [10, 30, 124, 20],
      text: options.subtitle || '',
      color: options.subtitleColor || rocky.GColorBlack,
      font: options.subtitleFont || rocky.FONT_KEY_GOTHIC_24
    });
    card._body = new parent.Text({
      bounds: [10, 60, 124, 108],
      text: options.body || '',
      color: options.bodyColor || rocky.GColorBlack,
      font: options.bodyFont || rocky.FONT_KEY_GOTHIC_18
    });

    card.add(card._title);
    card.add(card._subtitle);
    card.add(card._body);

    card.title = function(data) {
      this._title.set(data);
      return this;
    };

    card.subtitle = function(data) {
      this._subtitle.set(data);
      return this;
    };

    card.body = function(data) {
      this._body.set(data);
      return this;
    };

    return card;
  };

  this.MenuItem = function(options) {
    options = options || {};

    var menuItem = new parent.Element(options);

    menuItem._background = new parent.Rect(options);

    menuItem._title = new parent.Text({
      bounds: options.bounds.slice(0),
      text: options.title || '',
      color: options.titleColor || rocky.GColorBlack,
      font: options.titleFont || rocky.FONT_KEY_GOTHIC_28
    });

    menuItem._details = new parent.Text({
      bounds: options.bounds.slice(0),
      text: options.details || '',
      color: options.detailsColor || rocky.GColorBlack,
      font: options.detailsFont || rocky.FONT_KEY_GOTHIC_18
    });

    // Modify the bounds:
    menuItem._title.bounds[0] += 5;
    menuItem._title.bounds[1] += 0;

    menuItem._details.bounds[0] += 5;
    menuItem._details.bounds[1] += 27;

    menuItem.title = function(data) {
      this._title.set(data);
      return this;
    };

    menuItem.details = function(data) {
      this._details.set(data);
      return this;
    };

    menuItem._render = function(ctx, bounds) {
      this._background._render(ctx, bounds);
      this._title._render(ctx, bounds);
      this._details._render(ctx, bounds);
    };

    return menuItem;
  };

  // A Menu is not an Element
  // But it is a Window (which is an Element)
  this.Menu = function(options) {
    options = options || {};

    var menu = new parent.Window(options);

    menu._current = 0;
    menu._items = options.list || [];

    menu._titleBar = new parent.Rect({
      bounds: [0, 0, 144, 24],
      backgroundColor: options.backgroundColor || rocky.GColorClear
    });

    menu._title = new parent.Text({
      bounds: [4, 3, 144, 20],
      text: options.title || '',
      font: options.titleFont || rocky.FONT_KEY_GOTHIC_14_BOLD
    });

    menu._itemBoxes = [];

    menu._itemBoxes.push(
      new parent.MenuItem({
        bounds: [0, 20, 144, 49],
        backgroundColor: options.selectedItemBackgroundColor || rocky.GColorBlack,
        title: '',
        titleColor: options.selectedItemColor || rocky.GColorWhite,
        details: '',
        detailsColor: options.selectedItemDetailsColor || rocky.GColorWhite
      })
    );

    menu._itemBoxes.push(
      new parent.MenuItem({
        bounds: [0, 69, 144, 49],
        backgroundColor: options.backgroundColor || rocky.GColorClear,
        title: '',
        titleColor: options.itemColor || rocky.GColorBlack,
        details: '',
        detailsColor: options.itemDetailsColor || rocky.GColorBlack
      })
    );

    menu._itemBoxes.push(
      new parent.MenuItem({
        bounds: [0, 118, 144, 49],
        backgroundColor: options.backgroundColor || rocky.GColorClear,
        title: '',
        titleColor: options.itemColor || rocky.GColorBlack,
        details: '',
        detailsColor: options.itemDetailsColor || rocky.GColorBlack
      })
    );

    menu._itemSeparator = new parent.Line({
      bounds: [0, 118, 144, 0],
      color: options.separatorColor || rocky.GColorBlack
    });

    menu.add(menu._titleBar);
    menu.add(menu._title);
    menu.add(menu._itemBoxes[0]);
    menu.add(menu._itemBoxes[1]);
    menu.add(menu._itemBoxes[2]);
    menu.add(menu._itemSeparator);

    menu._update = function() {
      for (var i = 0; i < 3; i++) {
        if (this._current + i < this._items.length) {
          this._itemBoxes[i]._title.set(this._items[this._current + i].title);
          this._itemBoxes[i]._details.set(this._items[this._current + i].details);
        } else {
          this._itemBoxes[i]._title.set('');
          this._itemBoxes[i]._details.set('');
        }
      }
    };

    menu._upHandler = function(event) {
      if (event.type === 'long') return;

      this._current = Math.max(0, --this._current);
      this._update();
      parent.mark_dirty();
    };

    menu._downHandler = function(event) {
      if (event.type === 'long') return;

      this._current = Math.min(this._items.length - 1, ++this._current);
      this._update();
      parent.mark_dirty();
    };

    menu._selectHandler = function(event) {
      if (this._items.length === 0) return;
      if (!this._onItemSelected) return;

      this._onItemSelected(this._items[this._current]);
    };

    menu.onUp = function(cb) {
      console.log('You cannot override a Menu\'s button handlers');
      return this;
    };

    menu.onDown = function(cb) {
      console.log('You cannot override a Menu\'s button handlers');
      return this;
    };

    menu.onSelect = function(cb) {
      console.log('You cannot override a Menu\'s button handlers');
      return this;
    };

    menu.onBack = function(cb) {
      console.log('You cannot override a Menu\'s button handlers');
      return this;
    };

    menu.push = function(item) {
      this._items.push(item);
      this._update();
      return this;
    };

    menu.select = function(id) {
      if (id < this._items.length) this._current = id;
      this._update();
      return this;
    };

    menu.onSelected = function(callback) {
      this._onItemSelected = callback.bind(this);
      return this;
    };

    return menu;
  };

  rocky.update_proc = this._render.bind(this);
  return this;
};
