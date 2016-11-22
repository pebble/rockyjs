/*global Rocky:false, Tangle:false*/

Rocky.bindTangle = function(args) {
  if (typeof (args) === 'undefined') {
    args = {};
  }

  var element = args.element;
  if (typeof (element) === 'undefined') {
    var target = document.documentElement; // start at the root element
    // find last HTMLElement child node
    while (target.childNodes.length && target.lastChild.nodeType === 1) {
      target = target.lastChild;
    }
    element = target.parentNode;
  }

  var canvas = args.canvas;
  if (typeof (canvas) === 'undefined') {
    canvas = element.querySelector('canvas');
  }

  var rocky = Rocky.bindCanvas(canvas);

  var tangle = new Tangle(element, {
    initialize: function() {
      var subElements = element.querySelectorAll('[data-var][data-init]');
      for (var i = 0; i < subElements.length; i++) {
        var subElement = subElements[i];
        var name = subElement.attributes['data-var'].value;
        var stringValue = subElement.attributes['data-init'].value;

        // this code can only handle numbers
        // as soon as we have more complex tangles,
        // we need a more capable implementation
        this[name] = parseFloat(stringValue);
      }
      if (typeof (args.initialize) === 'function') {
        args.initialize.call(this, element);
      }
    },
    update: function() {
      rocky.mark_dirty();
    }
  });

  rocky.update_proc = function(ctx, bounds) {
    args.update_proc(rocky, tangle, ctx, bounds);
  };
  rocky.mark_dirty();
};
