BorderRadius = PopKit.create({
  onLoad: function(value) {
    this._super();
    
    var parts      = value.match(/(\d+)/g),
        controller = BorderRadius.borderController;

    if (parts === null) {
      parts = [0];
      BorderRadius.borderController.set("firstDrag", true);
    } else {
      for (var i = 0; i < parts.length; i++) {
        parts[i] = parseInt(parts[i], 10);
      }
    }
    
    if (parts.length === 2) {
      controller.setProperties({
        topLeft:     parts[0],
        topRight:    parts[1],
        bottomRight: parts[0],
        bottomLeft:  parts[1]
      });
    } else if (parts.length === 3) {
      controller.setProperties({
        topLeft:     parts[0],
        topRight:    parts[1],
        bottomRight: parts[2],
        bottomLeft:  parts[1]
      });
    } else if (parts.length === 4) {
      controller.setProperties({
        topLeft:     parts[0],
        topRight:    parts[1],
        bottomRight: parts[2],
        bottomLeft:  parts[3]
      });
    } else {
      controller.setProperties({
        topLeft:     parts[0],
        topRight:    parts[0],
        bottomRight: parts[0],
        bottomLeft:  parts[0]
      });
    }
    
    Ember.run.next(controller, "updateCodaValue");
  }
});

BorderRadius.borderController = Ember.Object.create({
  topLeft:     0,
  topRight:    0,
  bottomRight: 0,
  bottomLeft:  0,
  
  firstDrag: false,
  
  setToMax: function() {
    var topLeft     = this.get("topLeft"),
        topRight    = this.get("topRight"), 
        bottomRight = this.get("bottomRight"),
        bottomLeft  = this.get("bottomLeft"),
        max         = Math.max(topLeft, topRight, bottomRight, bottomLeft);
        
    this.setProperties({
      topLeft:     max,
      topRight:    max,
      bottomRight: max,
      bottomLeft:  max
    })
  },
  
  resultString: function() {
    var topLeft     = this.get("topLeft"),
        topRight    = this.get("topRight"), 
        bottomRight = this.get("bottomRight"),
        bottomLeft  = this.get("bottomLeft");
    
    if ((topLeft == topRight) && (topLeft == bottomRight) && (topLeft == bottomLeft)) {
      return topLeft + "px";
    } else if ((topLeft == bottomRight) && (topRight == bottomLeft)) {
      return topLeft + "px " + topRight + "px";
    } else {
      return topLeft + "px " + topRight + "px " + bottomRight + "px " + bottomLeft + "px";
    }
  }.property("topLeft", "topRight", "bottomRight", "bottomLeft").cacheable(),
  
  updateCodaValue: function() {
    BorderRadius.setValue(this.get("resultString"));
  }.observes("resultString")
});

BorderRadius.Border = Ember.View.extend({
  classNames: "border",
  tlValue: 0,
  trValue: 50,
  brValue: 50,
  blValue: 0,
  
  didInsertElement: function() {
    this._tlRadiusDidChange();
    this._trRadiusDidChange();
    this._brRadiusDidChange();
    this._blRadiusDidChange();
    this._super();
  },
  
  topLeft: function(prop, value) {
    var tlValue = this.get("tlValue");
    if (!Ember.empty(value)) {
      this.set("tlValue", value);
      return value;
    } else {
      return tlValue;
    }
  }.property("tlValue").cacheable(),
  
  _tlRadiusDidChange: (function() {
    if (!this.get("element")) { return; }
    var value = this.get("tlValue");
    
    if (BorderRadius.borderController.get("firstDrag")) {
      this.setProperties({ topRight: value, bottomRight: value, bottomLeft: value });
    }
    
    this.get("element").style.borderTopLeftRadius = value + "px";
  }).observes("tlValue"),
  
  topRight: function(prop, value) {
    var trValue = this.get("trValue");
    if (!Ember.empty(value)) {
      this.set("trValue", 50 - value);
      return value;
    } else {
      return 50 - trValue;
    }
  }.property("trValue").cacheable(),
  
  _trRadiusDidChange: (function() {
    if (!this.get("element")) { return; }
    var value = 50 - this.get("trValue");
    
    if (BorderRadius.borderController.get("firstDrag")) {
      this.setProperties({ topLeft: value, bottomRight: value, bottomLeft: value });
    }
    
    this.get("element").style.borderTopRightRadius = value + "px";
  }).observes("trValue"),
  
  bottomRight: function(prop, value) {
    var brValue = this.get("brValue");
    if (!Ember.empty(value)) {
      this.set("brValue", 50 - value);
      return value;
    } else {
      return 50 - brValue;
    }
  }.property("brValue").cacheable(),
  
  _brRadiusDidChange: (function() {
    if (!this.get("element")) { return; }
    var value = 50 - this.get("brValue");
    
    if (BorderRadius.borderController.get("firstDrag")) {
      this.setProperties({ topLeft: value, topRight: value, bottomLeft: value });
    }
    
    this.get("element").style.borderBottomRightRadius = value + "px";
  }).observes("brValue"),
  
  bottomLeft: function(prop, value) {
    var blValue = this.get("blValue");
    if (!Ember.empty(value)) {
      this.set("blValue", value);
      return value;
    } else {
      return blValue;
    }
  }.property("blValue").cacheable(),
  
  _blRadiusDidChange: (function() {
    if (!this.get("element")) { return; }
    var value = this.get("blValue");
    
    if (BorderRadius.borderController.get("firstDrag")) {
      this.setProperties({ topLeft: value, topRight: value, bottomRight: value });
    }
    
    this.get("element").style.borderBottomLeftRadius = value + "px";
  }).observes("blValue")
});

BorderRadius.Slider = JUI.Slider.extend({
  min: 0,
  max: 50,
  orientation: 'horizontal',
  
  stop: function() {
    if (BorderRadius.borderController.get("firstDrag")) {
      BorderRadius.borderController.set("firstDrag", false);
    }
  }
});