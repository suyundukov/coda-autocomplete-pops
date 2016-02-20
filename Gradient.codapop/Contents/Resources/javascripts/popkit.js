var PopKit;

PopKit = Em.Namespace.create({
  loaded: false,
  create: function(details) {
    var app;
    if (details == null) details = {};
    if (this.get("app")) throw "Only one PopKit app allowed";
    details.settingsStore = PopKit.Settings.create();
    app = PopKit.Application.create(details);
    this.set("app", app);
    if (this.get("loaded")) this.onLoad();
    return app;
  },
  onLoad: function() {
    var app;
    app = this.get("app");
    if (app != null) app.onLoad.apply(app, arguments);
    return this.set("loaded", true);
  }
});

PopKit.Application = Em.Application.extend({
  watchingEscape: false,
  onLoad: function() {
    var isFirstRun;
    isFirstRun = this.getPreference("firstRun");
    if (typeof isFirstRun === "undefined") {
      this.setPreference("firstRun", false);
      this.initializeDefaults();
    }

    if (!this.get("watchingEscape")) {
      var self = this;
      
      $(document).keyup(function(evt) {
        if (evt.keyCode == 27) {
          if (typeof Coda !== "undefined") {
            Coda.closePop();
          }
          return false;
        }
      });

      this.set("watchingEscape", true);
    }
  },
  getOriginalValue: function() {
    return typeof Coda !== "undefined" && Coda !== null ? Coda.originalString() : void 0;
  },
  getProperty: function() {
    return typeof Coda !== "undefined" && Coda !== null ? Coda.property() : void 0;
  },
  getValue: function() {},
  setValue: function(value) {
    if ((typeof Coda !== "undefined") && (Coda !== null)) {
      Coda.popValueDidChange(value);
    } else {
      console.debug("Coda.popValueDidChange", value);
    }
  },
  initializeDefaults: function() {},
  getPreference: function(key) {
    return this.get("settingsStore").read(key);
  },
  setPreference: function(key, value) {
    return this.get("settingsStore").write(key, value);
  }
});

PopKit.Settings = Em.Object.extend({
  read: function(key) {
    var result;
    if (typeof Coda === "undefined" || Coda === null) return;
    result = Coda.preferenceForKey(key);
    if (result != null) result = JSON.parse(result);
    return result;
  },
  write: function(key, value) {
    if (typeof Coda === "undefined" || Coda === null) return;
    if (!(typeof value === "string")) value = JSON.stringify(value);
    return Coda.setPreferenceForKey(value, key);
  }
});


PopKit.Color = Em.Object.extend(Em.Copyable, {
  rgb: (function() {
    return PopKit.Color.hsbToRgb(this.get("hsb"));
  }).property("hsb"),
  copy: function() {
    return PopKit.Color.create({
      hsb: this.get("hsb")
    });
  }
});

PopKit.Color.reopenClass({
  hsbToRgb: function(hsb) {
    var b, br, f, h, hue, p, q, s, t;
    h = hsb[0], s = hsb[1], b = hsb[2];
    br = Math.round(b / 100 * 255);
    if (s == 0) {
      return [br, br, br];
    } else {
      hue = h % 360;
      f = hue % 60;
      p = Math.round((hsb[2] * (100 - s)) / 10000 * 255);
      q = Math.round((hsb[2] * (6000 - s * f)) / 600000 * 255);
      t = Math.round((hsb[2] * (6000 - s * (60 - f))) / 600000 * 255);
      switch (Math.floor(hue / 60)) {
        case 0:
          return [br, t, p];
        case 1:
          return [q, br, p];
        case 2:
          return [p, br, t];
        case 3:
          return [p, q, br];
        case 4:
          return [t, p, br];
        case 5:
          return [br, p, q];
        default:
          return false;
      }
    }
  },
  rgbToHsl: function(rgb)
  {
  	var r, g, b;
  	
  	r = rgb[0], g = rgb[1], b = rgb[2];
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
 
    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
 
    h = Math.round(h * 360);
    s = Math.round(s * 100);
	l = Math.round(l * 100);
	
    return [h, s, l];
  },
  hslToRgb: function(hsl)
  {
  	var h, s, l, r, g, b;
	h = hsl[0] / 360, s = hsl[1] / 100, l = hsl[2] / 100;
	
	 if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
 
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
 
    return [r * 255, g * 255, b * 255].map(Math.round);
  
  },
  rgbToHsb: function(rgb) {
    var blue, br, brightness, delta, gr, green, hue, max, min, red, rr, saturation;
    red = rgb[0], green = rgb[1], blue = rgb[2];
	hue = 0;
    max = Math.max(red, green, blue);
    min = Math.min(red, green, blue);
	delta = max - min;
    brightness = max / 255;
    saturation = max != 0 ? delta / max : 0;
    
	
	if (saturation != 0) {
      rr = (max - red) / delta;
      gr = (max - green) / delta;
      br = (max - blue) / delta;

      if (red == max) {
        hue = br - gr;
      } else if (green == max) {
        hue = 2 + rr - br;
	  } else {
        hue = 4 + gr - rr;
      }
      hue /= 6;
      if (hue < 0) hue++;
	  
    }
    return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
  },
  hexToRgba: function(hexString) {
    var hex, part, parts;
    hex = hexString.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})(\w{1,2})?$/);
    hex[4] || (hex[4] = "ff");
    return parts = (function() {
      var _i, _len, _ref, _results;
      _ref = hex.slice(1);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        part = _ref[_i];
        if (part.length == 1) part += part;
        _results.push(parseInt(part, 16));
      }
      return _results;
    })();
  },
  nameMap: {
    aliceblue: "#F0F8FF",
    antiquewhite: "#FAEBD7",
    aqua: "#00FFFF",
    aquamarine: "#7FFFD4",
    azure: "#F0FFFF",
    beige: "#F5F5DC",
    bisque: "#FFE4C4",
    black: "#000000",
    blanchedalmond: "#FFEBCD",
    blue: "#0000FF",
    blueviolet: "#8A2BE2",
    brown: "#A52A2A",
    burlywood: "#DEB887",
    cadetblue: "#5F9EA0",
    chartreuse: "#7FFF00",
    chocolate: "#D2691E",
    coral: "#FF7F50",
    cornflowerblue: "#6495ED",
    cornsilk: "#FFF8DC",
    crimson: "#DC143C",
    cyan: "#00FFFF",
    darkblue: "#00008B",
    darkcyan: "#008B8B",
    darkgoldenrod: "#B8860B",
    darkgray: "#A9A9A9",
    darkgreen: "#006400",
    darkgrey: "#A9A9A9",
    darkkhaki: "#BDB76B",
    darkmagenta: "#8B008B",
    darkolivegreen: "#556B2F",
    darkorange: "#FF8C00",
    darkorchid: "#9932CC",
    darkred: "#8B0000",
    darksalmon: "#E9967A",
    darkseagreen: "#8FBC8F",
    darkslateblue: "#483D8B",
    darkslategray: "#2F4F4F",
    darkslategrey: "#2F4F4F",
    darkturquoise: "#00CED1",
    darkviolet: "#9400D3",
    deeppink: "#FF1493",
    deepskyblue: "#00BFFF",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1E90FF",
    firebrick: "#B22222",
    floralwhite: "#FFFAF0",
    forestgreen: "#228B22",
    fuchsia: "#FF00FF",
    gainsboro: "#DCDCDC",
    ghostwhite: "#F8F8FF",
    gold: "#FFD700",
    goldenrod: "#DAA520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#ADFF2F",
    grey: "#808080",
    honeydew: "#F0FFF0",
    hotpink: "#FF69B4",
    indianred: "#CD5C5C",
    indigo: "#4B0082",
    ivory: "#FFFFF0",
    khaki: "#F0E68C",
    lavender: "#E6E6FA",
    lavenderblush: "#FFF0F5",
    lawngreen: "#7CFC00",
    lemonchiffon: "#FFFACD",
    lightblue: "#ADD8E6",
    lightcoral: "#F08080",
    lightcyan: "#E0FFFF",
    lightgoldenrodyellow: "#FAFAD2",
    lightgray: "#D3D3D3",
    lightgreen: "#90EE90",
    lightgrey: "#D3D3D3",
    lightpink: "#FFB6C1",
    lightsalmon: "#FFA07A",
    lightseagreen: "#20B2AA",
    lightskyblue: "#87CEFA",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#B0C4DE",
    lightyellow: "#FFFFE0",
    lime: "#00FF00",
    limegreen: "#32CD32",
    linen: "#FAF0E6",
    magenta: "#FF00FF",
    maroon: "#800000",
    mediumaquamarine: "#66CDAA",
    mediumblue: "#0000CD",
    mediumorchid: "#BA55D3",
    mediumpurple: "#9370DB",
    mediumseagreen: "#3CB371",
    mediumslateblue: "#7B68EE",
    mediumspringgreen: "#00FA9A",
    mediumturquoise: "#48D1CC",
    mediumvioletred: "#C71585",
    midnightblue: "#191970",
    mintcream: "#F5FFFA",
    mistyrose: "#FFE4E1",
    moccasin: "#FFE4B5",
    navajowhite: "#FFDEAD",
    navy: "#000080",
    oldlace: "#FDF5E6",
    olive: "#808000",
    olivedrab: "#6B8E23",
    orange: "#FFA500",
    orangered: "#FF4500",
    orchid: "#DA70D6",
    palegoldenrod: "#EEE8AA",
    palegreen: "#98FB98",
    paleturquoise: "#AFEEEE",
    palevioletred: "#DB7093",
    papayawhip: "#FFEFD5",
    peachpuff: "#FFDAB9",
    peru: "#CD853F",
    pink: "#FFC0CB",
    plum: "#DDA0DD",
    powderblue: "#B0E0E6",
    purple: "#800080",
    red: "#FF0000",
    rosybrown: "#BC8F8F",
    royalblue: "#4169E1",
    saddlebrown: "#8B4513",
    salmon: "#FA8072",
    sandybrown: "#F4A460",
    seagreen: "#2E8B57",
    seashell: "#FFF5EE",
    sienna: "#A0522D",
    silver: "#C0C0C0",
    skyblue: "#87CEEB",
    slateblue: "#6A5ACD",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#FFFAFA",
    springgreen: "#00FF7F",
    steelblue: "#4682B4",
    tan: "#D2B48C",
    teal: "#008080",
    thistle: "#D8BFD8",
    tomato: "#FF6347",
    turquoise: "#40E0D0",
    violet: "#EE82EE",
    wheat: "#F5DEB3",
    white: "#FFFFFF",
    whitesmoke: "#F5F5F5",
    yellow: "#FFFF00",
    yellowgreen: "#9ACD32"
  },
  nameToRgba: function(name) {
    return this.hexToRgba(this.nameMap[name]);
  },
  rgbToHex: function() {
    var arg, args, bit, hex;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    if (args[3]) args[3] = Math.ceil(args[3] * 255);
    hex = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        arg = args[_i];
        bit = (arg - 0).toString(16);
        if (bit.length == 1) {
          _results.push("0" + bit);
        } else {
          _results.push(bit);
        }
      }
      return _results;
    })();
    return "#" + (hex.join(''));
  },
  
  parseString: function(value) {
    value = value.replace(/\s/, "");
    
    // Might be a named string
    if (PopKit.Color.nameMap[value]) {
      return this._colorFromName(value);
    }

    // Might be hex
    if (value.match(/^#/)) {
      return this._colorFromHex(value);
    }

    // Might be rgba string
    var rgbaCore = value.match(/rgba?\((.*)\)/);
    if (rgbaCore) {
      var rgbaParts = rgbaCore[1].split(",");
      return this._colorWithPosition(
        parseInt(rgbaParts[0], 10),
        parseInt(rgbaParts[1], 10),
        parseInt(rgbaParts[2], 10),
        (rgbaParts[3] || 1) * 100
      );
    }
  },
  
  _colorWithPosition: function(r, g, b, a) {
    var hsb = PopKit.Color.rgbToHsb([r, g, b]);
    var height = 256;
    var x = hsb[1] / (100 / height);
    var y  = 256 - (hsb[2] / (100 / 256));

    // White?
    if ((hsb[1] == 0) && (hsb[2] == 100)) {
      y = 0;
    }
    
    return {
      r: r,
      g: g,
      b: b,
      opacity: a,
      x: ~~x,
      y: ~~y
    };
  },
  
  _colorFromHex: function(hexString) {
    var rgba = PopKit.Color.hexToRgba(hexString);
    return this._colorWithPosition(
      rgba[0], 
      rgba[1], 
      rgba[2], 
      Math.ceil(rgba[3] / 2.55)
    );
  },

  _colorFromName: function(name) {
    var rgba = PopKit.Color.nameToRgba(name);
    return this._colorWithPosition(
      rgba[0], 
      rgba[1], 
      rgba[2], 
      Math.ceil(rgba[3] / 2.55)
    );
  }
});

PopKit.SliderWidget = JUI.Slider.extend({
  min: 0,
  max: 100,
  orientation: 'horizontal'
});

PopKit.Slider = Em.View.extend({
  smallerLabel: null,
  largerLabel: null,
  value: 0,
  template: Em.Handlebars.compile("{{#if smallerLabel}}\n  <label class=\"less\">{{smallerLabel}}</label>\n{{/if}}\n<div class=\"track\">\n  {{view PopKit.SliderWidget classNames=\"slider\" valueBinding=\"value\"}}\n</div>\n{{#if largerLabel}}\n  <label class=\"more\">{{largerLabel}}</label>\n{{/if}}"),
  didInsertElement: function() {
    var _this = this;
    this._super();
    this.$(".less").click(function() {
      return _this.set("value", 0);
    });
    return this.$(".more").click(function() {
      return _this.set("value", 100);
    });
  }
});

PopKit.SnapSliderWidget = JUI.Slider.extend({
  min: 0,
  max: 109,
  orientation: 'horizontal',
  realValue: (function() {
    var v;
    v = this.get("value");
    if (v < 10) {
      return 0;
    } else {
      return v - 9;
    }
  }).property("value").cacheable(),
  slide: function(evt, ui) {
	if (ui.value <= 5) {
	this.set("value", 0);
	return evt.preventDefault();
	} else if (ui.value <= 10) {
	this.set("value", 10);
	return evt.preventDefault();
	} else {
	return this.set("value", ui.value);
	}

  }
});

PopKit.SnapSlider = Em.View.extend({
  smallerLabel: null,
  largerLabel: null,
  value: 0,
  template: Em.Handlebars.compile("{{#if smallerLabel}}\n  <label class=\"less\">{{smallerLabel}}</label>\n{{/if}}\n<div class=\"snap-track\">\n  <div class=\"sep\"></div>\n  {{view PopKit.SnapSliderWidget classNames=\"snap-slider\" valueBinding=\"value\"}}\n  <span class=\"zero\">0</span>\n  <span class=\"one\">1</span>\n  <span class=\"hundred\">100</span>\n</div>\n{{#if largerLabel}}\n  <label class=\"more\">{{largerLabel}}</label>\n{{/if}}"),
  didInsertElement: function() {
    var _this = this;
    this._super();
    this.$(".less").click(function() {
      return _this.set("value", 0);
    });
    return this.$(".more").click(function() {
      return _this.set("value", 109);
    });
  }
});

PopKit.Swatch = Em.Button.extend({
  classNames: "swatch",
  template: Em.Handlebars.compile("<div class=\"checkered\"></div>\n<div class=\"color\"></div>"),
  
  color: null,
  
  didInsertElement: function() {
    this._super();
    this._colorDidChange();
  },
  
  _colorDidChange: function() {
    var color = this.get("color");
    if (!Ember.empty(color)) {
      this.$(".color").css({ "background-color": color });
    }
  }.observes("color")
});
var onLoad, setPopValue;

onLoad = function() {};

setPopValue = function(value) {
  return PopKit.onLoad(value);
};