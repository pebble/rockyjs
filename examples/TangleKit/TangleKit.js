//
//  TangleKit.js
//  Tangle 0.1.0
//
//  Created by Bret Victor on 6/10/11.
//  (c) 2011 Bret Victor.  MIT open-source license.
//


//https://stackoverflow.com/questions/1643320/get-month-name-from-date
Date.prototype.getMonthName = function(lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    return Date.locale[lang].month_names[this.getMonth()];
};

Date.prototype.getMonthNameShort = function(lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    return Date.locale[lang].month_names_short[this.getMonth()];
};

Date.locale = {
    en: {
       month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
       month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
};


(function () {


//----------------------------------------------------------
//
//  TKIf
//
//  Shows the element if value is true (non-zero), hides if false.
//
//  Attributes:  data-invert (optional):  show if false instead.

Tangle.classes.TKIf = {

    initialize: function (element, options, tangle, variable) {
        this.isInverted = !!options.invert;
    },

    update: function (element, value) {
        if (this.isInverted) { value = !value; }
        if (value) { element.style.removeProperty("display"); }
        else { element.style.display = "none" };
    }
};


//----------------------------------------------------------
//
//  TKSwitch
//
//  Shows the element's nth child if value is n.
//
//  False or true values will show the first or second child respectively.

Tangle.classes.TKSwitch = {

    update: function (element, value) {
        element.getChildren().each( function (child, index) {
            if (index != value) { child.style.display = "none"; }
            else { child.style.removeProperty("display"); }
        });
    }
};


//----------------------------------------------------------
//
//  TKSwitchPositiveNegative
//
//  Shows the element's first child if value is positive or zero.
//  Shows the element's second child if value is negative.

Tangle.classes.TKSwitchPositiveNegative = {

    update: function (element, value) {
        Tangle.classes.TKSwitch.update(element, value < 0);
    }
};

//----------------------------------------------------------
//
// TKSelect
//
// Click to switch between a list a given list of child element
// values. Works like TKToggle, but takes a list of child element
// values of any length.

Tangle.classes.TKSelect = {

    initialize: function (element, options, tangle, variable) {
        element.addEvent("click", function (event) {
            var selections = element.getChildren();
            var isActive = tangle.getValue(variable);
            if(isActive < selections.length -1){
                tangle.setValue(variable, isActive + 1);
            } else {
                tangle.setValue(variable, 0);
            }

        });
    }
};

//----------------------------------------------------------
//
//  TKToggle
//
//  Click to toggle value between 0 and 1.

Tangle.classes.TKToggle = {

    initialize: function (element, options, tangle, variable) {
        element.addEvent("click", function (event) {
            var isActive = tangle.getValue(variable);
            tangle.setValue(variable, isActive ? 0 : 1);
        });
    }
};


//----------------------------------------------------------
//
//  TKIncrement
//
//  Click to increment value (modulo the number of options).

Tangle.classes.TKIncrement = {

    initialize: function (element, options, tangle, variable) {
        element.addEvent("click", function (event) {
            var value = tangle.getValue(variable);
            tangle.setValue(variable, ++value % element.getChildren().length);
        });
    },
	
    update: function (element, value) {
        element.getChildren().each( function (child, index) {
            child.style.display = (index != value) ? "none" : "inline";
        });
    }
};


//----------------------------------------------------------
//
//  TKNumberField
//
//  An input box where a number can be typed in.
//
//  Attributes:  data-size (optional): width of the box in characters

Tangle.classes.TKNumberField = {

    initialize: function (element, options, tangle, variable) {
        this.input = new Element("input", {
    		type: "text",
    		"class":"TKNumberFieldInput",
    		size: options.size || 6
        }).inject(element, "top");

        var inputChanged = (function () {
            var value = this.getValue();
            tangle.setValue(variable, value);
        }).bind(this);

        this.input.addEvent("keyup",  inputChanged);
        this.input.addEvent("blur",   inputChanged);
        this.input.addEvent("change", inputChanged);
	},

	getValue: function () {
        var value = parseFloat(this.input.get("value"));
        return isNaN(value) ? 0 : value;
	},

	update: function (element, value) {
	    var currentValue = this.getValue();
	    if (value !== currentValue) { this.input.set("value", "" + value); }
	}
};


//----------------------------------------------------------
//
//  TKAdjustableNumber
//
//  Drag a number to adjust.
//
//  Attributes:  data-min (optional): minimum value
//               data-max (optional): maximum value
//               data-step (optional): granularity of adjustment (can be fractional)
//               data-help (optional): the help text that appears above the value. defaults to "« drag »"

var isAnyAdjustableNumberDragging = false;  // hack for dragging one value over another one

Tangle.classes.TKAdjustableNumber = {

    initialize: function (element, options, tangle, variable) {
        this.element = element;
        this.tangle = tangle;
        this.variable = variable;

        this.min = (options.min !== undefined) ? parseFloat(options.min) : 0;
        this.max = (options.max !== undefined) ? parseFloat(options.max) : 1e100;
        this.step = (options.step !== undefined) ? parseFloat(options.step) : 1;
        this.help = (options.help !== undefined) ? options.step : "« drag »";
        
        this.initializeHover();
        this.initializeHelp();
        this.initializeDrag();
    },


    // hover

    initializeHover: function () {
        this.isHovering = false;
        this.element.addEvent("mouseenter", (function () { this.isHovering = true;  this.updateRolloverEffects(); }).bind(this));
        this.element.addEvent("mouseleave", (function () { this.isHovering = false; this.updateRolloverEffects(); }).bind(this));
    },

    updateRolloverEffects: function () {
        this.updateStyle();
        this.updateCursor();
        this.updateHelp();
    },

    isActive: function () {
        return this.isDragging || (this.isHovering && !isAnyAdjustableNumberDragging);
    },

    updateStyle: function () {
        if (this.isDragging) { this.element.addClass("TKAdjustableNumberDown"); }
        else { this.element.removeClass("TKAdjustableNumberDown"); }

        if (!this.isDragging && this.isActive()) { this.element.addClass("TKAdjustableNumberHover"); }
        else { this.element.removeClass("TKAdjustableNumberHover"); }
    },

    updateCursor: function () {
        var body = document.getElement("body");
        if (this.isActive()) { body.addClass("TKCursorDragHorizontal"); }
        else { body.removeClass("TKCursorDragHorizontal"); }
    },


    // help

    initializeHelp: function () {
        this.helpElement = (new Element("div", { "class": "TKAdjustableNumberHelp" })).inject(this.element, "top");
        this.helpElement.setStyle("display", "none");
        this.helpElement.set("text", this.help);
    },

    updateHelp: function () {
        var show = ((this.isHovering && !isAnyAdjustableNumberDragging) || this.isDragging)
        if (show) {
            this.helpElement.setStyle("display", "block");
            var top = - this.helpElement.getSize().y * 0.5;
            var left = Math.round(0.5 * (this.element.getSize().x - this.helpElement.getSize().x));
            this.helpElement.setStyles({ left:left, top:top });
        } else {
            this.helpElement.setStyle("display", "none");
        }
    },


    // drag

    initializeDrag: function () {
        this.isDragging = false;
        new BVTouchable(this.element, this);
    },

    touchDidGoDown: function (touches) {
        this.valueAtMouseDown = this.tangle.getValue(this.variable);
        this.isDragging = true;
        isAnyAdjustableNumberDragging = true;
        this.updateRolloverEffects();
        this.updateStyle();
    },

    touchDidMove: function (touches) {
        var value = this.valueAtMouseDown + touches.translation.x / 5 * this.step;
        value = ((value / this.step).round() * this.step).limit(this.min, this.max);
        this.tangle.setValue(this.variable, value);
        this.updateHelp();
    },

    touchDidGoUp: function (touches) {
        this.isDragging = false;
        isAnyAdjustableNumberDragging = false;
        this.updateRolloverEffects();
        this.updateStyle();
        this.helpElement.setStyle("display", touches.wasTap ? "block" : "none");
    }
};

//----------------------------------------------------------
//
//  TKInlineSlider
//
//  Drag a slider inline with the text to adjust the value (the slider updates accordingly).
//
//  Attributes:  data-min (optional): minimum value
//               data-max (optional): maximum value
Tangle.classes.TKInlineSlider = {
            initialize: function (element, options, tangle, variable) {
                this.max = options.max || 10;
                this.min = options.min || 0;
                this.width = element.getCoordinates().width;
                this.barElement = (new Element("div", { "class":"TKInlineSliderBar" })).inject(element);
                var updateWithTouches = (function (touches) {
                    var x = touches.event.page.x - element.getPosition().x;
                    var value = Math.round(x / this.width * (this.max - this.min) + this.min);
                    value = value.limit(this.min, this.max);
                    tangle.setValue(variable, value);
                }).bind(this);
                new BVTouchable(element, { touchDidGoDown:updateWithTouches, touchDidMove:updateWithTouches, touchDidGoUp:function(){} });
            },
            update: function (element, value) {
                this.barElement.setStyle("width", Math.round(this.width * (value - this.min) / (this.max - this.min)));
            }
        };

//----------------------------------------------------------
//
//  TKExpandingList
//
//  Click once to show a list of items to chose from; click one of them to chose it and update the values accordingly.
//
//  Attributes:  data-items: items to chose from, separated by a separator (default /). E.g. data-items="shirts/hats/pants"
//               data-separator (optional, defaults to slash /): separator for the items in the data-items string 

Tangle.classes.TKExpandingList = {
            initialize: function (element, options, tangle, variable) {
                var isExpanded = false;
                this.separator = options.separator || "/";
                var items = options.items.split(this.separator);
                
                var subelements = [];
                subelements.push(new Element("span", { text:"[ " }));
                items.each(function (item, index) {
                    var itemElement = new Element("span", { "class":"TKExpandingListItem", text:item });
                    itemElement.onclick = function () { itemWasClicked(item); }
                    subelements.push(itemElement);
                    if (index < items.length - 1) {
                        subelements.push(new Element("span", { text:", " }));
                    }
                });
                subelements.push(new Element("span", { text:" ]" }));
                
                subelements.each(function (subelement) { subelement.inject(element, "bottom"); });
                
                function itemWasClicked (item) {
                    isExpanded = !isExpanded;
                    tangle.setValue(variable, item);
                    update(element,item);  // update expanded, even if variable doesn't change
                }
                
                function update (element, value) {
                    subelements.each(function (subelement) {
                        var text = subelement.get("text");
                        subelement.style.display = (isExpanded || text == value) ? "inline" : "none";
                    });
                }
                this.update = update;
            }
        };
    
    
//----------------------------------------------------------
//
//  TKExpandingSet
//
//  Click to select and deselect items from a list
//
//  Attributes:  data-items: items to chose from, separated by a separator (default /). E.g. data-items="shirts/hats/pants"
//               data-separator (optional, defaults to slash /): separator for the items in the data-items string 
 
    Tangle.classes.TKExpandingSet = {
            initialize: function (element, options, tangle, variable) {
                var isExpanded = false;
                this.separator = options.separator || "/";
                var items = options.items.split(this.separator);
                
                var subelements = [];

                var summaryElement = new Element("span", { "class":"TKExpandingSetSummary" });
                summaryElement.onclick = function () { summaryWasClicked(); }
                subelements.push(summaryElement);
                
                subelements.push(new Element("span", { text:"[ " }));
                items.each(function (item, index) {
                    var itemElement = new Element("span", { "class":"TKExpandingSetItem", text:item });
                    itemElement.onclick = function () { itemWasClicked(item); }
                    subelements.push(itemElement);
                    if (index < items.length - 1) {
                        subelements.push(new Element("span", { text:", " }));
                    }
                });
                subelements.push(new Element("span", { text:" ]" }));
                
                subelements.each(function (subelement) { subelement.inject(element, "bottom"); });
                setExpanded(false);
                
                function isItemSelected (item) {
                    var selectedItems = tangle.getValue(variable);
                    return !!selectedItems[item];
                }

                function setItemSelected (item, selected)  {
                    var newSelectedItems = Object.clone(tangle.getValue(variable));
                    if (selected) { newSelectedItems[item] = true; }
                    else { delete newSelectedItems[item]; }
                    tangle.setValue(variable, newSelectedItems);
                }
                
                function itemWasClicked (item) {
                    setItemSelected(item, !isItemSelected(item));
                }
                
                function summaryWasClicked () {
                    setExpanded(true);
                }
                
                function setExpanded (expanded) {
                    isExpanded = expanded;
                    subelements.each(function (subelement) {
                        subelement.style.display = (subelement === summaryElement ? !expanded : expanded) ? "inline" : "none";
                    });
                }
                
                function update (element, selectedItems) {
                    subelements.each(function (subelement, index) {
                        if (!subelement.hasClass("TKExpandingSetItem")) { return; }
                        var isSelected = !!selectedItems[subelement.get("text")];
                        if (isSelected) { subelement.addClass("TKExpandingSetItemSelected"); }
                        else { subelement.removeClass("TKExpandingSetItemSelected"); }
                    });


                    var summaryText = ""; 
                    if (items.length == 0) {
                        //nothing to show here, nothing was selected
                        summaryText = "";
                    } else if (items.length == 1) {
                        summaryText = items[0];
                    } else if (items.length == 2) {
                        summaryText = items[0] + " and " + items[1];
                    } else {
                        var allButLast = items.slice(0, items.length - 1);
                        summaryText = allButLast.join(", ") + ", and " + items[items.length - 1];
                    }
                    summaryElement.set("text", summaryText);
                }
                this.update = update;
            }
        };
    


//----------------------------------------------------------
//
//  formats
//
//  Most of these are left over from older versions of Tangle,
//  before parameters and printf were available.  They should
//  be redesigned.
//

function formatValueWithPrecision (value,precision) {
    if (Math.abs(value) >= 100) { precision--; }
    if (Math.abs(value) >= 10) { precision--; }
    return "" + value.round(Math.max(precision,0));
}

Tangle.formats.p3 = function (value) {
    return formatValueWithPrecision(value,3);
};

Tangle.formats.neg_p3 = function (value) {
    return formatValueWithPrecision(-value,3);
};

Tangle.formats.p2 = function (value) {
    return formatValueWithPrecision(value,2);
};

Tangle.formats.e6 = function (value) {
    return "" + (value * 1e-6).round();
};

Tangle.formats.abs_e6 = function (value) {
    return "" + (Math.abs(value) * 1e-6).round();
};

Tangle.formats.freq = function (value) {
    if (value < 100) { return "" + value.round(1) + " Hz"; }
    if (value < 1000) { return "" + value.round(0) + " Hz"; }
    return "" + (value / 1000).round(2) + " KHz";
};

Tangle.formats.dollars = function (value) {
    return "$" + value.round(0);
};

Tangle.formats.free = function (value) {
    return value ? ("$" + value.round(0)) : "free";
};

Tangle.formats.percent = function (value) {
    return "" + (100 * value).round(0) + "%";
};

Tangle.formats.height = function (value) {
	return Math.floor(value/12) + "&prime;" + value%12 + "&Prime;";
};


Tangle.formats.default = function (value) { return "" + value; };
Tangle.formats.hidden = function (value) { return ""; };

/*
data-var = var
data-scale = how many units per image
data-imagewidth = image width
data-imageheight = image height
data-imagefile = imagepath
*/
        
Tangle.classes.TKPictureGrid = {
    initialize: function (element, options, tangle, variable) {
    
        this.scale = options.scale || 1;
        this.imageheight = options.imageheight || 20;
        this.imagewidth = options.imagewidth || 20;
        this.imagefile = options.image || 'picgrid.png';
        element.setStyle("position", "relative");
    },
    
    update: function (element, value) {
    
        var imgCount = Math.ceil(value/this.scale);
    
    
        var imgAspect = this.imageheight / this.imagewidth;
        var viewSize = element.getSize();
        var viewWidth = viewSize.x;
        var viewHeight = viewSize.y;
      
        var rowCount, columnCount, imgWidth = 0, imgHeight = 0;
        for (var tryRowCount = 1; tryRowCount < 10; tryRowCount++) {
        	var tryColumnCount = Math.ceil(imgCount / tryRowCount);
        	var tryImgWidth = Math.floor(viewWidth / tryColumnCount);
        	var tryImgHeight = Math.floor(tryImgWidth * imgAspect);
        	if (tryImgHeight * tryRowCount > viewHeight) {
        		tryImgHeight = Math.floor(viewHeight / tryRowCount);
        		tryImgWidth = Math.round(tryImgHeight / imgAspect);
        	}
        	if (tryImgWidth < imgWidth) { 
        	    break; 
        	}
    
        	rowCount = tryRowCount;
        	columnCount = tryColumnCount;
        	imgWidth = tryImgWidth;
        	imgHeight = tryImgHeight;
        }
    
        // make sure the grid containers exist, and there are enough images for the grid
    
        var imageGridDiv = $(element.firstChild);
        var imageGridPartialDiv = $(element.lastChild);
        
        if (!imageGridDiv) {
        	imageGridDiv = (new Element("div", { "style": "position:relative;" })).inject(element);
        	imageGridPartialDiv = (new Element("div", { "style": "position:absolute; background-color:rgba(255,255,255,0.9);" })).inject(element);
        }

        var childrenCount = imageGridDiv.getChildren().length;
        while (childrenCount < imgCount) {
        	(new Element("img", { "src": this.imagefile})).inject(imageGridDiv);
        	childrenCount++;
        }
        while (childrenCount > imgCount) {
        	imageGridDiv.removeChild(imageGridDiv.lastChild);
        	childrenCount--;
        }
    
        // update the image positions and sizes
        
        var columnIndex = 0;
        var rowIndex = 0;
    
        imageGridDiv.getChildren().each( function(img) {
        	img.setStyle("width", imgWidth);
        	img.setStyle("height", imgHeight);
            img.setStyle('float', 'left');
        	columnIndex++;
        	if (columnIndex >= columnCount) {
        		columnIndex = 0;
        		rowIndex++;
        	}
        });
    
        // update the whited-out section of the last image
        var overShoot = imgCount * this.scale - value;
        if (overShoot != 0) {
            var partialValueLeft = this.scale - overShoot;
            var coverThisMuch = imgHeight * (1 - (partialValueLeft / this.scale));
            imageGridPartialDiv.setStyle("display", "block");
            imageGridPartialDiv.setStyle("width", imgWidth);
            imageGridPartialDiv.setStyle("height", coverThisMuch);
        
            var imageToCover = $(imageGridDiv.lastChild);
            if (imageToCover) {
                positionToCover = imageToCover.getPosition($(imageGridDiv));
                imageGridPartialDiv.setStyle("top", positionToCover.y);
                imageGridPartialDiv.setStyle("left", positionToCover.x);
            }
        } else {
            imageGridPartialDiv.setStyle("display", "none");
        }
    }
};


/*
data-max = either a number or the name of a variable that is the max value for the graph
data-var - the variable to graph
*/
Tangle.classes.TKHorizontalGraphBar = {
    isNumeric: function( obj ) {
        if(!Array.isArray) {
            Array.isArray = function(arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }
        return !Array.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
    },
    initialize: function (element, options, tangle, variable) {
        this.max = options.max || 100;
        this.tangle = tangle;
    },
    update: function (element, value) {
        var maxValue = this.isNumeric(this.max) ? this.max : this.tangle.getValue(this.max);
        var barDiv = element.getElement(".BarGraphBarDiv");
        if (!barDiv) {
    	    barDiv = (new Element("div", { "class":"BarGraphBarDiv" })).inject(element);
        }
        var containerSize = element.getSize();
        var width;
        if (maxValue == 0) {
            width = 0;
        } else {
            width = (value / maxValue * containerSize.x).round();
        }
        barDiv.setStyle("width", width);
    }
};


/*

data-var = var
data-scale = how many units per image
data-imagewidth = image width
data-imageheight = image height
data-imagestack = percent how much the images cover each other (when stacked)
data-imagefile = imagepath
data-align = vertical or horizontal
data-max = the value that would correspond to the full bar
*/
        
Tangle.classes.TKPictureBar = {
    initialize: function (element, options, tangle, variable) {
    
        this.scale = options.scale || 1;
        this.imageheight = options.imageheight || 20;
        this.imagewidth = options.imagewidth || 20;
        this.imagestack = options.imagestack || 'default';
        if (this.imagestack != 'default') {
            if (this.imagestack < 0) this.imagestack = 0; else if (this.imagestack > 99) this.imagestack = 99;
        }
        this.imagefile = options.image || 'picgrid.png';
        this.align = options.align || 'vertical';
        this.max = options.max || 'none';
        element.setStyle("position", "relative");
    },
    
    update: function (element, value) {
        var imgCount = Math.ceil(value/this.scale);
        var viewSize = element.getSize();
        var viewWidth = viewSize.x;
        var viewHeight = viewSize.y;
        
        if (this.imagestack == 'default') { //stacking must be calculated here
            //calculate stacking so as to fill full bar up to width/height
            var matchDimension = (this.align == 'vertical') ? viewHeight : viewWidth;
            var directionDimension = (this.align == 'vertical') ? this.imageheight : this.imagewidth;
            //uncovered part x (numImages - 1) + one full image dimension = matchDimension
            //=> (matchDimension - full imagedimension) / (numImages - 1) = uncovered part;
            // of course, if we need to show a bar with max value "max", then numImages is calculated accordingly
            var numImages = imgCount;
            if (this.max != 'none') {             
                numImages = Math.ceil(this.max/this.scale);
            }

            if (numImages > 1) {
                this.imagestack = (matchDimension - directionDimension) / (numImages - 1);
            } else {
                this.imagestack = 0;
            }
            if (this.imagestack > directionDimension) {
                this.imagestack = directionDimension;
            }
        }
                      
        // make sure the grid containers exist, and there are enough images for the grid
        var imageGridDiv = $(element.firstChild);
        var imageGridPartialDiv = $(element.lastChild);
        
        if (!imageGridDiv) {
        	imageGridDiv = (new Element("div", { "style": "position:relative;" })).inject(element);
        	imageGridPartialDiv = (new Element("div", { "style": "position:absolute; background-color:rgba(255,255,255,0.9);" })).inject(element);
        }
        
        var childrenCount = imageGridDiv.getChildren().length;
        while (childrenCount < imgCount) {
        	(new Element("img", { "src": this.imagefile})).inject(imageGridDiv);
        	childrenCount++;
        }
        while (childrenCount > imgCount) {
        	imageGridDiv.removeChild(imageGridDiv.lastChild);
        	childrenCount--;
        }
    
        // update the image positions and sizes
        //new* needed because this refers to another object inside each
        var imgIndex = 0, newWidth = this.imagewidth, newHeight = this.imageheight, newStack = this.imagestack, newAlign = this.align;
        
        imageGridDiv.getChildren().each( function(img) {
        	img.setStyle('width', newWidth + 'px');
        	img.setStyle("height", newHeight + 'px');
            img.setStyle('position', 'absolute');
            img.setStyle('z-index', imgIndex);
            if (newAlign == 'vertical') {
                img.setStyle('top', (viewHeight - newHeight) /*lowest base*/ - (imgIndex * newStack) /*elevation due to stacking*/ + 'px');
        	} else {
        	    img.setStyle('left', (imgIndex * newStack) /*shift due to stacking*/ + 'px');
        	}
        	imgIndex++;
        });
/*      // update the whited-out section of the last image
        var partialValueLeft = imgCount * this.scale - value;
        if (partialValueLeft != 0) {
            var coverThisMuch = imgHeight * (1 - (partialValueLeft / this.scale));
            imageGridPartialDiv.setStyle("display", "block");
            imageGridPartialDiv.setStyle("width", imgWidth);
            imageGridPartialDiv.setStyle("height", coverThisMuch);
        
            var imageToCover = $(imageGridDiv.lastChild);
            if (imageToCover) {
                positionToCover = imageToCover.getPosition($(imageGridDiv));
                imageGridPartialDiv.setStyle("top", positionToCover.y);
              imageGridPartialDiv.setStyle("left", positionToCover.x);
            }
        } else {
            imageGridPartialDiv.setStyle("display", "none");
        }
    */
    }
};

/*
data-var: the variable to show
data-mapto: day/week/month/quarter, is the variable a day, week, or what
data-scope: week/month/quarter/year: what is the highest level that the whole calendar shows, i.e. could be a calendar for a month or for whole year
data-zoom: what is the lowest level that the calendar shows, from data-mapto up to one before data-span
data-start: date that must be in the shown calendar, ideally start date but not necessarily, format yyyy-mm-dd
*/
Tangle.classes.TKProgressCalendar = {
//http://javascript.about.com/library/bldayyear.htm
    getDOY: function(d) {
        var onejan = new Date(this.getFullYear(d),0,1);
        return Math.ceil((d - onejan) / 86400000);
    },
    getFullYear: function(d) {
        return d.getYear() + 1900;
    },

//see http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
    getWeekNumber: function(d) {
        // Copy date so we don't modify original
        d = new Date(+d);
        d.setHours(0,0,0);
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay()||7));
        // Get first day of year
        var yearStart = new Date(d.getFullYear(),0,1);
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
        return {year: this.getFullYear(d), weekNo: weekNo};
    },
    getDayBaseMonday: function(d) {
        return (d + 6) % 7;
    },
    getMondayOfWeek: function(d) {
        d = new Date(+d);
        //roll back to monday of the week of d
        while (this.getDayBaseMonday(d.getDay()) != 0) {
            d.setDate(d.getDate() - 1);
        }
        return d;
    },
    correctWeekNumber: function(weekNumber, d) {
        if (d.getMonth() == 0 && weekNumber == 52) {
            weekNumber = 1;
        } else if (d.getMonth() == 11 && weekNumber == 1) {
            weekNumber = 52;
        } 
        return weekNumber;
    },
    makeWeek: function(start, zoom) {
        var start = new Date(+start);
        var month = start.getMonth();
        var weeknr = this.getWeekNumber(start).weekNo;
        weeknr = this.correctWeekNumber(weeknr, start);

        correctedStart = this.getMondayOfWeek(start); //roll back to monday
        
        var answer = '<table><tr><th align="right" width="12.5%">W' + weeknr + '</th>';
        //now walk all days from that monday.
        for (var i = 0; i < 7; i++) {
            var day = this.getDayBaseMonday(correctedStart.getDay());
            var date = correctedStart.getDate();
            var doy = this.getDOY(correctedStart);
            if (correctedStart.getMonth() == month) {
                //this date belongs to the month of interest (not previous or next)
                answer += '<td  align="right" width="12.5%" class="day day-' + doy + '">' + date + '</td>';
            } else {
                answer += '<td  align="right" width="12.5%" class="day emptyday"></td>';
            }
            correctedStart.setDate(correctedStart.getDate() + 1);
        }
        answer += '</tr></table>';
        return answer;
    },
    makeMonth: function(start, zoom) {
        start = new Date(+start);
        start.setDate(1);
        
        var answer = '';
        var month = start.getMonth();
        var monthName = start.getMonthName();
        
        //these should come after the above assignments because those assignments depend on the non-corrected value
        var startOfWeek = this.getMondayOfWeek(start); //roll back to monday
        var correctedStart = start;
        if (correctedStart.getDate() != startOfWeek.getDate()) {
            correctedStart = startOfWeek; //correct start here so it 
        }
        
        if (zoom == 'year' || zoom == 'quarter' || zoom == 'month') { //this should not have come here at all
            //do nothing
        } else if (zoom == 'week') {
            answer = '<tr>';
            var weeks = 0;
            do {
                weeks++;
                var weekNumber = this.getWeekNumber(correctedStart).weekNo;
                weekNumber = this.correctWeekNumber(weekNumber, start);
                answer += '<td class="week week-' + weekNumber + '">W' + weekNumber + '</td>';
                correctedStart.setDate(correctedStart.getDate() + 7);
            } while (month == correctedStart.getMonth());
            answer = '<table><tr><th colspan="' + weeks +'">' + monthName + '</th></tr><tr>' + answer + '</tr></table>';
        } else { //zoom must be == day
            answer = '<table><tr><th>' + monthName + '</th></tr>';
            if (correctedStart != start) { //the week starts on another day which, since start is the first of the month, means the week starts in another month already
                //therefore do the first week based on start, the rest on correctedStart 
                var weekNumber = this.getWeekNumber(start).weekNo;
                weekNumber = this.correctWeekNumber(weekNumber, start);
                answer += '<tr><td class="week week-' + weekNumber + '">' + this.makeWeek(start,zoom) + '</td></tr>';
                correctedStart.setDate(correctedStart.getDate() + 7);
            }
            do {
                weekNumber = this.getWeekNumber(correctedStart).weekNo;
                weekNumber = this.correctWeekNumber(weekNumber, start);
                answer += '<tr><td class="week week-' + weekNumber + '">' + this.makeWeek(correctedStart,zoom) + '</td></tr>';
                correctedStart.setDate(correctedStart.getDate() + 7); 
            } while (month == correctedStart.getMonth());
            answer += '</table>';
        }
        return answer;
    },
    makeQuarter: function(start, zoom) {
        start = new Date(+start);
        var firstMonthOfQuarter = Math.floor(start.getMonth() / 3) * 3;
        var answer = '<table width="100%"><tr>';
        if (zoom == 'year' || zoom == 'quarter') { //this should not have come here at all
            //do nothing
        } else {
            for (var i = 0; i < 3; i++) {
                start.setMonth(firstMonthOfQuarter + i);
                start.setDate(1);
                answer += '<td class="month month-' + (start.getMonth() + 1) + '"width="33%" align="right" valign="top">';
                if (zoom == 'month') {
                    answer += start.getMonthName();
                } else {
                    answer += this.makeMonth(start,zoom);
                }
                answer +='</td>';
            }
        }
        answer += '</tr></table>';
        return answer;
    },
    makeYear: function(start, zoom) {
        start = new Date(+start);
        var answer = '<table width="100%">';
        if (zoom == 'year') { //do nothing, no point in having just one box
            //do nothing
        } else if (zoom == 'quarter') {
           answer += '<tr><th align="center" colspan="4">' + this.getFullYear(start) + '</th></tr><tr>';
           for (var q = 0; q < 4; q++) {
                answer += '<th class="quarter quarter-' + (q + 1) + '" width="25%">Q' + (q + 1) + '</th>'; 
            }
            answer += '</tr>';
        } else {
            answer += '<tr><th align="center" colspan="2">'  + this.getFullYear(start) + '</th></tr>';
            for (var q = 0; q < 4; q++) {
                var firstMonthOfQuarter = q * 3;
                start.setMonth(firstMonthOfQuarter);
                start.setDate(1);
                answer += '<tr><th width="10%">Q' + (q + 1) + '</th><td class="quarter quarter-' + (q + 1) + '">' + this.makeQuarter(start,zoom) + '</td></tr>';
            }
        }
        answer += '</table>';
        return answer;
    },
    initialize: function (element, options, tangle, variable) {
        this.mapto = options.mapto || 'day';
        this.start = new Date(options.start || new Date());
        this.scope = options.scope || 'month';
        this.zoom = options.zoom || 'day';
        this.oldValue = 0;
        $(element).set('html', this.makeYear(new Date(this.start), this.zoom));
        
    },
    
    update: function (element, value) {
    
        var selectors = [];
        
        if (value < this.oldValue) {
            for (i = this.oldValue; i > value; i--) {
                selectors.push('.' + this.mapto + '-' + i);
            }
            selectors = selectors.join(',');
            $$(selectors).each(function (elem) {
                elem.removeClass('TKProgressCalendar-completed');
            });
        } else if (value > this.oldValue) {
            for (i = this.oldValue; i <= value; i++) {
                selectors.push('.' + this.mapto + '-' + i);
            }        
            selectors = selectors.join(',');
            $$(selectors).each(function (elem) {
                elem.addClass('TKProgressCalendar-completed');
            });
        }
        this.oldValue = value;
    
    }
};


Tangle.classes.TKFillBottle = {
    isNumeric: function( obj ) {
        if(!Array.isArray) {
            Array.isArray = function(arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }
        return !Array.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
    },
    initialize: function (element, options, tangle, variable) {
        this.min = options.min || 0;
        this.max = options.max || 100;
        this.liquid = options.liquid || '#0000ff';
        this.bottle = options.bottle || 'bottle.png';
        this.direction = options.direction || 'vertical';
        this.tangle = tangle;
        $(element).setStyle('position', 'relative');
        (new Element("img", { "src": this.bottle, 'class': 'TKFillBottleBottle'})).inject(element);
        (new Element("div", { "class": 'TKFillBottleLiquid', 'style':'width:0px;height:0px;z-index:-1'})).inject(element);
    },
    update: function (element, value) {
        var maxValue = this.isNumeric(this.max) ? this.max : this.tangle.getValue(this.max);
        var minValue = this.isNumeric(this.min) ? this.min : this.tangle.getValue(this.min);
        if (maxValue <= minValue) {
            maxValue = minValue + 1;
        }
        if (value > maxValue) {
            value = maxValue;
        } else if (value < minValue) {
            value = minValue;
        }
        var liquidDiv = element.getElement(".TKFillBottleLiquid");
        liquidDiv.setStyle('background', this.liquid);
        var bottle = element.getElement('.TKFillBottleBottle');
        var bottleSize = bottle.getSize();
        var bottlePosition = bottle.getPosition(element);
        var dimension;
        if (this.direction == 'vertical') {
            dimension = ((value - minValue) / (maxValue - minValue) * bottleSize.y).round();
            liquidDiv.setStyles({
                position: 'absolute',
                width: bottleSize.x + 'px',
                height: dimension + 'px',
                left: bottlePosition.x + 'px',
                top: (bottlePosition.y + (bottleSize.y - dimension)) + 'px',
                'z-index': '-1'
            });
        } else {
            dimension = ((value - minValue) / (maxValue - minValue) * bottleSize.x).round();
            liquidDiv.setStyles({
                position: 'absolute',
                width: dimension + 'px',
                height: bottleSize.y + 'px',
                left: (bottlePosition.x + (bottleSize.x - dimension)) + 'px',
                top: bottlePosition.y + 'px',
                'z-index': '-1'
            });
        }
    }
};



//----------------------------------------------------------

})();


