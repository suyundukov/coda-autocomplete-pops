BoxShadow = PopKit.create({
  onLoad: function(value) {
    this._super();
    
    var parts      = value.match(/(inset)?(?:\s+)?(\d+)(?:\w+)?\s+(\d+)(?:\w+)?\s+(\d+)(?:\w+)?\s+(?:(\d+)(?:\w+))?\s*(.*)/),
        controller = BoxShadow.mainController,
        isInset    = false;
    
    if (parts === null) {
      parts = ["0 0 0 black", undefined, "0", "0", "0", undefined, "black"];
    }
    
    if (parts[1] === "inset") {
      isInset = true;
    }
    
    parts[2] = parseInt(parts[2], 10);
    parts[3] = parseInt(parts[3], 10);
    parts[4] = parseInt(parts[4], 10);
    
    if (typeof parts[5] === "undefined") {
      parts[5] = "0";
    }
    parts[5] = parseInt(parts[5], 10);
    
    var x = 0;
    var y = 0;
    var blur = 0;
    var spread = 0;
    
    if (typeof parts[2] !== "undefined") {
      x = parts[2];
      if (x > 0) { x += 9; }
    }
  
    if (typeof parts[3] !== "undefined") {
      y = parts[3];
      if (y > 0) { y += 9; }
    }
  
    if (typeof parts[4] !== "undefined") {
      blur = parts[4];
      if (blur > 0) { blur += 9; }
    }
    
    if (typeof parts[5] !== "undefined") {
      spread = parts[5];
    }
    
    controller.setProperties({
      x:      x,
      y:      y,
      blur:   blur,
      spread: spread,
      inset:  isInset,
      color:  parts[6]
    });
    
    setTimeout(function() {
      controller._insetDidChange();
      Ember.run.next(controller, "updateCodaValue");
    }, 30);
  }
});

BoxShadow.mainController = Em.Object.create({
  x: 0,
  y: 0,
  blur: 0,
  spread: 0,
  inset: false,
  color: "black",
  
  _insetDidChange: function() {
    if (this.get("inset")) {
      $("#inset_radio").prop("checked", true);
    } else {
      $("#outset_radio").prop("checked", true);
    }
  }.observes("inset"),
  
  realX: function() {
    var x = this.get("x");
    return x < 10 ? 0 : (x - 9);
  }.property("x").cacheable(),
  
  realY: function() {
    var y = this.get("y");
    return y < 10 ? 0 : (y - 9);
  }.property("y").cacheable(),
  
  realBlur: function() {
    var blur = this.get("blur");
    return blur < 10 ? 0 : (blur - 9);
  }.property("blur").cacheable(),
  
  resultString: function() {
    var output = "";
    
    var inset = this.get("inset");
    if (inset) {
      output += "inset ";
    }
    
    output += this.get("realX") + "px";
    output += " " + this.get("realY") + "px";
    output += " " + this.get("realBlur") + "px";
    
    var spread = this.get("spread");
    if (spread > 0) {
      output += " " + spread + "px";
    }
    
    output += " " + this.get("color");
    
    return output;
  }.property("realX", "realY", "realBlur", "spread", "inset", "color").cacheable(),

  updateCodaValue: function() {
    BoxShadow.setValue(this.get("resultString"));
  }.observes("resultString"),

  openColorPop: function() {
    var color       = this.get("color"),
        output      = this.get("resultString"),
        colorStart  = output.indexOf(color),
        colorLength = color.length; 

    Coda.openPop("com.panic.pop.colorpicker", "left=34, bottom=12, location=" + colorStart + ", length=" + colorLength);
  }
});

$("#outset_radio").live("change", function() {
  BoxShadow.mainController.set("inset", !$("#outset_radio").is(":checked"));
});

$("#inset_radio").live("change", function() {
  BoxShadow.mainController.set("inset", $("#inset_radio").is(":checked"));
});