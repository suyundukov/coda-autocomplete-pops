var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Gradient = PopKit.create({
  
  onLoad: function(value) {
    this._super();
    
    var storedSwatches = this.getPreference("swatches");
    if (typeof storedSwatches === "undefined" || storedSwatches == "" ) {
		//need at least one stored gradient for this to work 
	 	this.initializeDefaults();
      	storedSwatches = this.getPreference("swatches");
    }
    
    Gradient.swatchesController.set("content", storedSwatches.map(
      function(swatchData) {
        return Gradient.Swatch.create({
          colorStops: Ember.Object.create(swatchData).get("colorStops").map(function(colorStopData) {
            return Gradient.ColorStop.create(colorStopData);
          })
        });
      }
    ));
    
    var basicMatcher = /(.*linear-gradient)\((.*)\)/i;
    var isGradient = value.match(basicMatcher);
    
    if (isGradient) {
      var placeholderValue = isGradient[2];
      
      //check for empty args and fill with default values so we have something to edit
      if ( jQuery.trim(placeholderValue).length == 0 )
      	placeholderValue = "#ffffff 0%";
      
      var hexRegex  = /#[A-Fa-f0-9]{3,6}/gi;
      var rgbRegex  = /rgb\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/gi;
      var rgbaRegex = /rgba\s*\(s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(1|0|0?.\d+\s*)\)/gi;
    
      var foundHexValues = [];
      var foundHexes = placeholderValue.match(hexRegex);
      if (foundHexes) {
        for (var i = 0; i < foundHexes.length; i++) {
          var hexVal = foundHexes[i];
          if (foundHexValues.indexOf(hexVal) == -1) {
            placeholderValue = placeholderValue.replace(hexVal, "__hex_" + foundHexValues.length + "__");
            foundHexValues.push(hexVal);
          }
        }
      }
    
      var foundRGBValues = [];
      var foundRGBs = placeholderValue.match(rgbRegex);
      if (foundRGBs) {
        for (var i = 0; i < foundRGBs.length; i++) {
          var rgbVal = foundRGBs[i];
          if (foundRGBValues.indexOf(rgbVal) == -1) {
            placeholderValue = placeholderValue.replace(rgbVal, "__rgb_" + foundRGBValues.length + "__");
            foundRGBValues.push(rgbVal);
          }
        }
      }
    
      var foundRGBAValues = [];
      var foundRGBAs = placeholderValue.match(rgbaRegex);
      if (foundRGBAs) {
        for (var i = 0; i < foundRGBAs.length; i++) {
          var rgbaVal = foundRGBAs[i];
          if (foundRGBAValues.indexOf(rgbaVal) == -1) {
            placeholderValue = placeholderValue.replace(rgbaVal, "__rgba_" + foundRGBAValues.length + "__");
            foundRGBAValues.push(rgbaVal);
          }
        }
      }
    
      var prefixedData = []
      var colorStopObjects = [];
      var gradientSegments = placeholderValue.split(",");
      
      for (var i = 0; i < gradientSegments.length; i++) {
        var gradientSegment = jQuery.trim(gradientSegments[i]);
        
        var colorStopParts = gradientSegment.split(/\s+/);
        var colorPortion   = jQuery.trim(colorStopParts[0]);
        var posPortion     = colorStopParts[1];
        
        if (typeof posPortion !== "undefined") {
          posPortion = jQuery.trim(posPortion);
        }
        
        var isColorStop = false;
        var originalFormat = "hex";
        
        var isHex = colorPortion.match(/__hex_(\d+)/);
        if (isHex) {
          isColorStop = foundHexValues[isHex[1]];
          originalFormat = "hex";
        }
        
        if (!isColorStop) {
          var isRgb = colorPortion.match(/__rgb_(\d+)/);
          if (isRgb) {
            isColorStop = foundRGBValues[isRgb[1]];
            originalFormat = "rgba";
          }
        }
        
        if (!isColorStop) {
          var isRgba = colorPortion.match(/__rgba_(\d+)/);
          if (isRgba) {
            isColorStop = foundRGBAValues[isRgba[1]];
            originalFormat = "rgba";
          }
        }
        
        if (!isColorStop) {
          if (PopKit.Color.nameMap[colorPortion]) {
            isColorStop = colorPortion;
            originalFormat = "name";
          }
        }
        
        if (isColorStop) {
          var colorStop = PopKit.Color.parseString(isColorStop);
          colorStop.pref = originalFormat;
          if (posPortion) {
            colorStop.position = parseFloat(posPortion);
          } else {
            colorStop.position = -1;
          }
          colorStopObjects.push(colorStop);
        } else {
          prefixedData.push(gradientSegment);
        }
      }
      
      for (var i = 0; i < colorStopObjects.length; i++) {
        var colorStopObject = colorStopObjects[i];
        
        if (colorStopObject.position == -1) {
          if (i == 0) {
            colorStopObject.position = 0;
          } else {
            colorStopObject.position = Math.floor((i / (colorStopObjects.length - 1)) * 100);
          }
        }
        
        colorStopObjects[i] = Gradient.ColorStop.create(colorStopObject);
      }
      
      Gradient.colorStopsController.setProperties({
        "prefixedData": prefixedData,
        "content":      colorStopObjects,
        "prefix":       isGradient[1]
      });
    } else {
      Gradient.colorStopsController.set("content", Gradient.swatchesController.getPath("content.firstObject.colorStops").copy());
    }
    
    var self = this;
    Ember.run.next(function() {
      var stops = $(".color_stop");
      if (stops.length) {
        var eId = stops.first().attr("id");
        var firstSliderView = Ember.View.views[eId];
        firstSliderView.set("hasFocus", true);
        Gradient.focusedSliderController.set("view", firstSliderView);
      }
      self.loaded = true;
    });
  },
  
  storeSwatches: function() {
    if (!this.loaded) { return; }
    
    this.setPreference("swatches", Gradient.swatchesController.map(
      function(swatchObject) {
        return swatchObject.toHash();
      }
    ));
  },

  initializeDefaults: function() {
    this.setPreference("swatches", [
      {
        colorStops: [
          {
            position: 0,
            r: 0,
            g: 0,
            b: 0,
            opacity: 100,
            x: 256,
            y: 256
          },
          {
            position: 100,
            r: 255,
            g: 255,
            b: 255,
            opacity: 100,
            x: 0,
            y: 0
          }
        ]
      }
    ]);
  }
});

Gradient.ColorStop = Em.Object.extend(Em.Copyable, {
  pref: "hex",
  position: 0.0,
  r: 0,
  g: 0,
  b: 0,
  opacity: 100,
  x: 0,
  y: 0,
  
  colorCSS: function() {
    var r = this.get("r"),
        g = this.get("g"),
        b = this.get("b"),
        opacity = this.get("opacity");
        
    var rgba = [r, g, b, (opacity / 100)];    

    var hex = PopKit.Color.rgbToHex(r, g, b);
    var pref = this.get("pref");
    
    if (pref === "name") {
      var name = null;
      for (var key in PopKit.Color.nameMap) {
        if (PopKit.Color.nameMap.hasOwnProperty(key)) {
          if (hex.toUpperCase() == PopKit.Color.nameMap[key].toUpperCase()) {
            name = key;
            break;
          }
        }
      }
    }
    
    if ((opacity < 100) || (pref === "rgba")) {
      return 'rgba(' + rgba.join(',') + ')';
    } else if (!Em.empty(name)) {
      return name;
    } else {
      return hex;
    }
  }.property("r", "g", "b", "opacity").cacheable(),
  
  
  colorStopCSS: (function() {
    return this.get("colorCSS") + " " + this.get("position") + "%";
  }).property("colorCSS", "position"),
  
  copy: function() {
    return Gradient.ColorStop.create({
      position: this.get("position"),
      r: this.get("r"),
      g: this.get("g"),
      b: this.get("b"),
      opacity: this.get("opacity"),
      x: this.get("x"),
      y: this.get("y")
    });
  },
  toHash: function() {
    return {
      position: this.get("position"),
      r: this.get("r"),
      g: this.get("g"),
      b: this.get("b"),
      opacity: this.get("opacity"),
      x: this.get("x"),
      y: this.get("y")
    };
  }
});

Gradient.Swatch = Em.Object.extend({
  isFull: true,
  colorStops: [],
  
  previewGradientCSS: (function() {
    
    var allStopsUnsorted, colorStops;
    allStopsUnsorted = this.get("colorStops").filter(function() {
      return true;
    });
    allStopsUnsorted = allStopsUnsorted.sort(function(a, b) {
      if (a.get("position") > b.get("position")) {
        return 1;
      } else {
        return -1;
      }
    });
    
    colorStops = allStopsUnsorted.mapProperty("colorStopCSS");
    return "-webkit-linear-gradient(left, " + (colorStops.join(", ")) + ")";
  }).property("@each.colorStopCSS").cacheable(),
  
  toHash: function() {
    return {
      colorStops: this.get("colorStops").map(function(colorStop) {
        return colorStop.toHash();
      })
    };
  }
});

Gradient.colorStopsController = Em.ArrayProxy.create({
  content: [],
  prefixedData: [],
  prefix: "-webkit-linear-gradient",
  gradientCSS: (function() {
    var allStopsUnsorted, colorStops;
    allStopsUnsorted = this.filter(function() {
      return true;
    });
    allStopsUnsorted = allStopsUnsorted.sort(function(a, b) {
      if (a.get("position") > b.get("position")) {
        return 1;
      } else {
        return -1;
      }
    });
    colorStops = allStopsUnsorted.mapProperty("colorStopCSS");
    var allParts = this.get("prefixedData");
    allParts = allParts.concat(colorStops);
    return this.get("prefix") + "(" + (allParts.join(", ")) + ")";
  }).property("@each.colorStopCSS", "prefix", "prefixedData").cacheable(),
  
  previewGradientCSS: (function() {
    var allStopsUnsorted, colorStops;
    allStopsUnsorted = this.filter(function() {
      return true;
    });
    allStopsUnsorted = allStopsUnsorted.sort(function(a, b) {
      if (a.get("position") > b.get("position")) {
        return 1;
      } else {
        return -1;
      }
    });
    colorStops = allStopsUnsorted.mapProperty("colorStopCSS");
    return "-webkit-linear-gradient(left, " + (colorStops.join(", ")) + ")";
  }).property("@each.colorStopCSS").cacheable(),

  _gradientCSSDidChange: function() {
    if (Gradient.loaded) {
      Gradient.setValue(this.get("gradientCSS"));
    }
  }.observes("gradientCSS"),
});

Gradient.focusedSliderController = Em.Object.create({
  view: null
});

Gradient.swatchesController = Em.ArrayProxy.create({
  content: [],
  withEmpty: (function() {
    var i, needs, normal;
    normal = this.filter(function() {
      return true;
    });
    needs = 7 - normal.get('length');
    if (needs > 0) {
      normal.pushObject(Em.Object.create({
        isAdd: true
      }));
      needs--;
    }
    for (i = 1; 1 <= needs ? i <= needs : i >= needs; 1 <= needs ? i++ : i--) {
      normal.pushObject(Em.Object.create({
        isEmpty: true
      }));
    }
    return normal;
  }).property("@each").cacheable(),
  
  _contentDidChange: function() {
    Gradient.storeSwatches();
  }.observes("@each.gradientCSS")
});

Gradient.ColorStopSlider = JUI.Slider.extend({
  classNames: ["color_stop"],
  classNameBindings: ["hasFocus"],
  min: 0,
  max: 100,
  step: 0.01,
  orientation: 'horizontal',
  valueBinding: "content.position",
  hasFocus: false,
  slide: function(event, ui){
 	 this.$(".close").css("opacity", "0");
	 this._super(event, ui);
  },
  stop: function(event, ui) {
 	 this.$(".close").css("opacity", "1");
  },
  willDestroyElement: function() {
    this.$(".ui-slider-handle").unbind("focus");
    this._super();
  },
  didInsertElement: function() {
	  var self = this;
    this._super();
	
	this.$(".close").click(function() {
		self.remove();
     	return false;
    });
	
	this.$(".ui-slider-handle").focus(__bind(function() {
      var oldView;
      oldView = Gradient.focusedSliderController.get("view");
      if (!Em.empty(oldView) && !oldView.isDestroyed) {
        oldView.set("hasFocus", false);
      }
      this.set("hasFocus", true);
      return Gradient.focusedSliderController.set("view", this);
    }, this));
    
	return this._hasFocusDidChange();
  },
  remove: function() {
    var self = this;
    var element, onTransitionEnd, transitions;
    transitions = 2;
    element = this.$().get(0);
    onTransitionEnd = function() {
      transitions--;
      if (!transitions) {
        element.removeEventListener("webkitTransitionEnd", onTransitionEnd);
        return self._removeColorStop();
      }
    };
    element.addEventListener("webkitTransitionEnd", onTransitionEnd);
    element.style.webkitTransition = "all 200ms ease-in-out";
    element.style.webkitTransform = "scale(1, 0)";
    element.style.opacity = "0";
  },
  _removeColorStop: function() {
      return Gradient.colorStopsController.removeObject(this.get("content"));
	  return false;
  },
  readyToChange: false,
  _colorPickerDidChange: (function() {
    if (!this.get("readyToChange")) {
      return;
    }
    return this.get("content").setProperties({
      r: ColorPicker.colorController.get("r"),
      g: ColorPicker.colorController.get("g"),
      b: ColorPicker.colorController.get("b"),
      opacity: ColorPicker.colorController.get("opacity"),
      x: ColorPicker.loupeController.get("x"),
      y: ColorPicker.loupeController.get("y")
    });
  }).observes("ColorPicker.colorController.r", "ColorPicker.colorController.g", "ColorPicker.colorController.b", "ColorPicker.colorController.opacity", "ColorPicker.colorController.x", "ColorPicker.colorController.y"),
  _hasFocusDidChange: (function() {
    var b, g, hue, opacity, r, s, _ref;
    if (this.get("hasFocus")) {
      r = this.getPath("content.r");
      g = this.getPath("content.g");
      b = this.getPath("content.b");
      opacity = this.getPath("content.opacity");
      _ref = PopKit.Color.rgbToHsb([r, g, b]);
      hue = _ref[0];
      s = _ref[1];
      b = _ref[2];
      ColorPicker.colorController.setProperties({
        opacity: opacity,
        hue: hue
      });
      ColorPicker.loupeController.setProperties({
        x: this.getPath("content.x"),
        y: this.getPath("content.y")
      });
      return Em.run.later(__bind(function() {
        return this.set("readyToChange", true);
      }, this), 100);
    } else {
      this.$(".mask").css("background-color", this.getPath("content.colorCSS"));
      return this.set("readyToChange", false);
    }
  }).observes("hasFocus")
});

Gradient.Preview = Em.View.extend({
  didInsertElement: function() {
    this.backgroundElem = this.$().get(0);
    return this._contentDidChange();
  },
  _contentDidChange: (function() {
    if (!this.backgroundElem) {
      return;
    }
    this.backgroundElem.style.backgroundImage = this.get("content");
  }).observes("content"),
  doubleClick: function(evt) {
    if (this.isRunning) { return; }
    this.isRunning = true;
    
    var newPosition, newStop, oldView;
    newPosition = Math.floor(100 * evt.offsetX / this.$().width());
    
    oldView = Gradient.focusedSliderController.get("view");
    if (!Em.empty(oldView) && !oldView.isDestroyed) {
      oldView.set("hasFocus", false);
    }
    newStop = Gradient.ColorStop.create({
      position: newPosition,
      r: ColorPicker.colorController.get("r"),
      g: ColorPicker.colorController.get("g"),
      b: ColorPicker.colorController.get("b"),
      opacity: ColorPicker.colorController.get("opacity"),
      x: ColorPicker.loupeController.get("x"),
      y: ColorPicker.loupeController.get("y")
    });
    Gradient.colorStopsController.pushObject(newStop);
    
    var self = this;
    return Em.run.later(function() {
      self.isRunning = false;
      return $(".color_stop").each(function() {
        var view;
        view = Em.View.views[this.id];
        if (view.get("content") !== newStop) {
          return;
        }
        oldView = Gradient.focusedSliderController.get("view");
        if (!Em.empty(oldView) && !oldView.isDestroyed) {
          oldView.set("hasFocus", false);
        }
        view.set("hasFocus", true);
        return Gradient.focusedSliderController.set("view", view);
      });
    }, 10);
  }
});

Gradient.SwatchButton = ColorPicker.SwatchButtonBase.extend({
  didInsertElement: function() {
    this._super();
    this.colorElement = this.$(".color").get(0);
    return this._gradientCSSDidChange();
  },
  _gradientCSSDidChange: (function() {
    this.colorElement.style.backgroundImage = this.getPath("content.previewGradientCSS");
  }).observes("content.previewGradientCSS"),
  onClickAdd: function() {
    var n;
    n = Gradient.Swatch.create({
      colorStops: Gradient.colorStopsController.map(function(c) {
        return c.copy();
      })
    });
    Gradient.swatchesController.pushObject(n);
    Gradient.colorStopsController.set("content", n.get("colorStops"));
  },
  onClickFull: function() {
    Gradient.colorStopsController.set("content", this.getPath("content.colorStops").map(function(c) {
      return c.copy();
    }));
    
    Ember.run.next(function() {
      var oldView;
      oldView = Gradient.focusedSliderController.get("view");
      if (!Em.empty(oldView) && !oldView.isDestroyed) {
        oldView.set("hasFocus", false);
      }
      
      var eId = $(".color_stop").first().attr("id");
      var firstSliderView = Ember.View.views[eId];
      firstSliderView.set("hasFocus", true);
      Gradient.focusedSliderController.set("view", firstSliderView);
    });
  },
  _removeFromList: function() {
    return Gradient.swatchesController.removeAt(this.get("contentIndex"), 1);
  }
});