TextShadow = PopKit.create({
  onLoad: function(value) {
    this._super();
    
    var parts      = value.match(/(?:\s+)?(\d+)(?:\w+)?\s+(\d+)(?:\w+)?(?:\s+(\d+)(?:\w+)?)?\s*(.*)/),
        controller = TextShadow.mainController;
        
    if (parts === null) {
      parts = ["0 0 0 black", "0", "0", "0", "black"];
    }
    
    parts[1] = parseInt(parts[1], 10);
    parts[2] = parseInt(parts[2], 10);
                           
    if (typeof parts[3] === "undefined") {
      parts[3] = "0";
    }
    parts[3] = parseInt(parts[3], 10);
    
    var x = 0;
    var y = 0;
    var blur = 0;
    
    if (typeof parts[1] !== "undefined") {
      x = parts[1];
      if (x > 0) { x += 9; }
    }
  
    if (typeof parts[2] !== "undefined") {
      y = parts[2];
      if (y > 0) { y += 9; }
    }
  
    if (typeof parts[3] !== "undefined") {
      blur = parts[3];
      if (blur > 0) { blur += 9; }
    }
    
    controller.setProperties({
      x:      x,
      y:      y,
      blur:   blur,
      color:  parts[4]
    });
    
    Ember.run.next(controller, "updateCodaValue");
  }
});

TextShadow.mainController = Em.Object.create({
  x: 0,
  y: 0,
  blur: 0,
  color: "black",
    
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
    
    output += this.get("realX") + "px";
    output += " " + this.get("realY") + "px";
    output += " " + this.get("realBlur") + "px";
        
    output += " " + this.get("color");
    
    return output;
  }.property("realX", "realY", "realBlur", "color").cacheable(),

  updateCodaValue: function() {
    TextShadow.setValue(this.get("resultString"));
  }.observes("resultString"),

  openColorPop: function() {
    var color       = this.get("color"),
        output      = this.get("resultString"),
        colorStart  = output.indexOf(color),
        colorLength = color.length; 

    Coda.openPop("com.panic.pop.colorpicker", "left=34, bottom=44, location=" + colorStart + ", length=" + colorLength);
  }
});
