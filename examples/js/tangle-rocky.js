Rocky.bindTangle = function(args) {
    if (typeof(args) == "undefined") {
        args = {};
    }

    var element = args.element;
    if (typeof(element) === "undefined") {
        var target = document.documentElement; // start at the root element
        while (target.childNodes.length && target.lastChild.nodeType == 1) { // find last HTMLElement child node
            target = target.lastChild;
        }
        element = target.parentNode;
    }

    var canvas = args.canvas;
    if (typeof(canvas) === "undefined") {
        canvas = element.querySelector("canvas");
    }

    var rocky = Rocky.bindCanvas(canvas);

    var tangle = new Tangle(element, {
        initialize: args.initialize,
        update: function () {
            rocky.mark_dirty();
        }
    });

    rocky.update_proc = function(ctx, bounds) {
        args.update_proc(rocky, tangle, ctx, bounds);
    };
    rocky.mark_dirty();


};