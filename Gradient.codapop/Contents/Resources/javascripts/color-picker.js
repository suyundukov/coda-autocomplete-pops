ColorPicker = Ember.Namespace.create();

ColorPicker.SwatchButtonBase = Em.View.extend({
  classNameBindings: ["content.isEmpty", "content.isFull", "content.isAdd"],
  onClick: function() {
    if (this.getPath("content.isAdd")) {
      this.onClickAdd();
    } else if (this.getPath("content.isFull")) {
      this.onClickFull();
    }
  },
  didInsertElement: function() {
    var self = this;
    this._super();
    
    this.$(".close").click(function() {
      self.remove();
      return false;
    });
    
    this.$().click(function() {
      self.onClick();
      return false;
    });
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
        return self._removeFromList();
      }
    };
    element.addEventListener("webkitTransitionEnd", onTransitionEnd);
    element.style.webkitTransition = "all 200ms ease-in-out";
    element.style.webkitTransform = "scale(0)";
    element.style.opacity = "0";
  },
  _removeFromList: function() {}
});

ColorPicker.Swatch = Em.Object.extend({
  isFull: true,
  r: 0,
  g: 0,
  b: 0,
  opacity: 100,
  x: 0,
  y: 0,
  toHash: function() {
    return {
      r: this.get("r"),
      g: this.get("g"),
      b: this.get("b"),
      opacity: this.get("opacity"),
      x: this.get("x"),
      y: this.get("y")
    };
  }
});

ColorPicker.colorController = Em.Object.create({
  r: 0,
  g: 0,
  b: 0,
  hue: 360,
  opacity: 100,
  
  resultString: function() {
    var r = this.get("r"),
        g = this.get("g"),
        b = this.get("b"),
        opacity = this.get("opacity");
        
    var rgba = [r, g, b, (opacity / 100)];

    var hex = PopKit.Color.rgbToHex(r, g, b);
    var pref = ColorPicker.get("preferredFormat");
    
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

    // var formats = {
    //   rgba: rgba,
    //   rgbaString: 'rgba(' + rgba.join(',') + ')',
    //   hex:  hex,
    //   hexWithAlpha: PopKit.Color.rgbToHex.apply(PopKit.Color, rgba),
    //   name: name
    // };
 
    if ( pref === "hsla" )
    {
    	var hsla = PopKit.Color.rgbToHsl(rgba);
    	return 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + rgba[3] + ')';
    }
    else if ((opacity < 100) || (pref === "rgba")) {
      return 'rgba(' + rgba.join(', ') + ')';
    } else if (!Em.empty(name)) {
      return name;
    } else {
      return hex;
    }
  }.property("r", "g", "b", "opacity", "hue").cacheable(),

  _resultStringDidChange: function() {
    if (ColorPicker.get("isReady")) {
      ColorPicker.setValue(this.get("resultString"));
    }
  }.observes("resultString")
});

ColorPicker.loupeController = Em.Object.create({
  x: 164,
  y: 90,
  canvasHeight: 256,
  canvasWidth: 256
});

ColorPicker.swatchesController = Em.ArrayProxy.create({
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
    ColorPicker.storeSwatches();
  }.observes("@each")
});

ColorPicker.HueSlider = JUI.Slider.extend({
  min: 0,
  max: 360,
  orientation: 'vertical',
  valueBinding: "ColorPicker.colorController.hue"
});

ColorPicker.Loope = Em.View.extend({
  // hueBinding: "ColorPicker.colorController.hue",
  opacityBinding: "ColorPicker.colorController.opacity",
  xBinding: "ColorPicker.loupeController.x",
  yBinding: "ColorPicker.loupeController.y",
  rBinding: "ColorPicker.colorController.r",
  gBinding: "ColorPicker.colorController.g",
  bBinding: "ColorPicker.colorController.b",
  didInsertElement: function() {
    this._super();
    this.backgroundElement = this.$(".thumb_background").get(0);
    this.wrapperElement = this.$(".thumb_wrapper").get(0);
    this._positionDidChange();
    return this.draw();
  },
  setPosition: function(x, y) {
    return this.setProperties({
      x: x,
      y: y
    });
  },
  draw: (function() {
    if (!this.backgroundElement) {
      return;
    }
    return this.backgroundElement.style.backgroundColor = "rgba(" + (this.get('r')) + ", " + (this.get('g')) + ", " + (this.get('b')) + ", " + (this.get('opacity') / 100.0) + ")";
  }).observes("r", "g", "b", "opacity"),
  _positionDidChange: (function() {
    var edgeDistance, flipX, flipY, loupeHeight, loupeWidth, positionX, positionY, rotation, x, y;
    if (!this.backgroundElement) {
      return;
    }
    x = this.get("x");
    y = this.get("y");
    loupeWidth = 35;
    loupeHeight = 34;
    positionY = y - loupeHeight;
    positionX = x;
    edgeDistance = 15;
    flipX = positionY <= edgeDistance;
    flipY = (positionX + loupeWidth) >= (255 - edgeDistance);
    if (flipX && flipY) {
      rotation = "180deg";
      positionY -= 1;
      positionX += 1;
    } else if (flipX) {
      rotation = "90deg";
      positionY -= 0;
    } else if (flipY) {
      rotation = "-90deg";
      positionX += 1;
      positionY += 1;
    } else {
      rotation = "0deg";
      positionX -= 1;
      positionY += 1;
    }
    this.$().get(0).style.webkitTransform = "translate(" + positionX + "px," + positionY + "px)";
    this.wrapperElement.style.webkitTransformOrigin = "0 " + loupeHeight + "px";
    this.wrapperElement.style.webkitTransition = "-webkit-transform 200ms ease-in-out";
    return this.wrapperElement.style.webkitTransform = "rotateZ(" + rotation + ")";
  }).observes("x", "y")
});

ColorPicker.OpacitySlider = JUI.Slider.extend({
  min: 0,
  max: 100,
  orientation: 'vertical',
  valueBinding: "ColorPicker.colorController.opacity",
  rBinding: "ColorPicker.colorController.r",
  gBinding: "ColorPicker.colorController.g",
  bBinding: "ColorPicker.colorController.b",
  didInsertElement: function() {
    this._super();
    this.overlayElement = this.$().parent().find(".opacity_overlay").get(0);
    return this._rgbDidChange();
  },
  _rgbDidChange: (function() {
    if (!this.overlayElement) {
      return;
    }
    return this.overlayElement.style.backgroundColor = "rgba(" + (this.get("r")) + ", " + (this.get("g")) + ", " + (this.get("b")) + ", 1)";
  }).observes("r", "g", "b")
});

ColorPicker.Picker = Em.View.extend({
  tagName: "canvas",
  rBinding: "ColorPicker.colorController.r",
  gBinding: "ColorPicker.colorController.g",
  bBinding: "ColorPicker.colorController.b",
  hueBinding: "ColorPicker.colorController.hue",
  xBinding: "ColorPicker.loupeController.x",
  yBinding: "ColorPicker.loupeController.y",
  canvasHeightBinding: "ColorPicker.loupeController.canvasHeight",
  canvasWidthBinding: "ColorPicker.loupeController.canvasWidth",
  didInsertElement: function() {
    this._super();
    this.palette = this.$().get(0);
    this.palette.width = this.get("canvasWidth");
    this.palette.height = this.get("canvasHeight");
    this.context = this.palette.getContext("2d");
    this.svSteps = 100 / this.palette.height;
    this.draw();
    return this._setupEvents();
  },
  _setupEvents: function() {
    var onMouseDown, onMouseUp, self, triggerSelected;
    this.isMouseDown = false;
    self = this;
    triggerSelected = function(evt) {
      var relativeX, relativeY;
      
	  relativeX = evt.clientX - 44 + 9;
      relativeY = evt.clientY - 20 + 9;
      if (relativeX < 0) {
        relativeX = 0;
      }
      if (relativeX > 256) {
        relativeX = 256;
      }
      if (relativeY < 0) {
        relativeY = 0;
      }
      if (relativeY > 256) {
        relativeY = 256;
      }
      
      return self.setProperties({
        x: relativeX,
        y: relativeY
      });
    };
    onMouseUp = function(evt) {
      self.isMouseDown = false;
      triggerSelected(evt);
      document.removeEventListener("mouseup", onMouseUp);
      return document.removeEventListener("mousemove", triggerSelected);
    };
    onMouseDown = function(evt) {
      evt.preventDefault();
      self.isMouseDown = true;
      document.addEventListener("mouseup", onMouseUp);
      return document.addEventListener("mousemove", triggerSelected);
    };
    return this.palette.addEventListener("mousedown", onMouseDown);
  },
  _positionDidChange: (function() {
    var b, g, r, _ref;
    if (!this.context) {
      return;
    }
    _ref = this._rgbForXY(this.get("x"), this.get("y")), r = _ref[0], g = _ref[1], b = _ref[2];
    
    return this.setProperties({
      r: r,
      g: g,
      b: b
    });
  }).observes("x", "y"),
  _rgbForXY: function(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);
    var startPosition;
    if (x > 255) {
      x = 255;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > 255) {
      y = 255;
    }
    if (y < 0) {
      y = 0;
    }
    
    startPosition = (y * this.palette.width + x) * 4;
    var rgb = [this.imageDataCache.data[startPosition], this.imageDataCache.data[startPosition + 1], this.imageDataCache.data[startPosition + 2]];
    if (rgb[0] <= 1)   { rgb[0] = 0; }
    if (rgb[1] <= 1)   { rgb[1] = 0; }
    if (rgb[2] <= 1)   { rgb[2] = 0; }
    if (rgb[0] >= 254) { rgb[0] = 255; }
    if (rgb[1] >= 254) { rgb[1] = 255; }
    if (rgb[2] >= 254) { rgb[2] = 255; }
    return rgb;
  },
  _hueDidChange: (function() {
    return this.draw();
  }).observes("hue"),
  draw: function() {
    var currentColor, startRGB, endRGB, gradient, vi, _ref;
    if (!this.context) {
      return;
    }
    currentColor = PopKit.Color.create({
      hsb: [this.get("hue"), 100, 100]
    });
    for (vi = _ref = this.palette.height; _ref <= 1 ? vi <= 1 : vi >= 1; _ref <= 1 ? vi++ : vi--) {
      gradient = this.context.createLinearGradient(0, 0, this.palette.width, 0);
      var vi1 = vi-1;
      startRGB = "rgb(" + vi1 + "," + vi1 + "," + vi1 + ")";
      gradient.addColorStop(0, startRGB);
      currentColor.get("hsb")[2] = vi * this.svSteps;
      endRGB = "rgb(" + (currentColor.get("rgb").join(',')) + ")";
      gradient.addColorStop(1, endRGB);
      this.context.fillStyle = gradient;
      this.context.fillRect(0, this.palette.height - vi, this.palette.height, 1);
    }
    this.imageDataCache = this.context.getImageData(0, 0, this.palette.width, this.palette.height);
    return this._positionDidChange();
  }
});

ColorPicker.SwatchButton = ColorPicker.SwatchButtonBase.extend({
  didInsertElement: function() {
    this._super();
    this.colorElement = this.$(".color").get(0);
    return this._colorDidChange();
  },
  _colorDidChange: (function() {
    return this.colorElement.style.backgroundColor = "rgba(" + (this.getPath('content.r')) + ", " + (this.getPath('content.g')) + ", " + (this.getPath('content.b')) + ", " + (this.getPath('content.opacity') / 100.0) + ")";
  }).observes("content.r", "content.g", "content.b", "content.opacity"),
  onClickAdd: function() {
    var n;
    n = ColorPicker.Swatch.create({
      r: ColorPicker.colorController.get("r"),
      g: ColorPicker.colorController.get("g"),
      b: ColorPicker.colorController.get("b"),
      opacity: ColorPicker.colorController.get("opacity"),
      x: ColorPicker.loupeController.get("x"),
      y: ColorPicker.loupeController.get("y")
    });
    return ColorPicker.swatchesController.pushObject(n);
  },
  onClickFull: function() {
    var b, g, hue, r, s, _ref;
    r = this.getPath("content.r");
    g = this.getPath("content.g");
    b = this.getPath("content.b");
    _ref = PopKit.Color.rgbToHsb([r, g, b]), hue = _ref[0], s = _ref[1], b = _ref[2];
    ColorPicker.colorController.setProperties({
      opacity: this.getPath("content.opacity"),
      hue: hue
    });
    return ColorPicker.loupeController.setProperties({
      x: this.getPath("content.x"),
      y: this.getPath("content.y")
    });
  },
  _removeFromList: function() {
    return ColorPicker.swatchesController.removeAt(this.get("contentIndex"), 1);
  }
});