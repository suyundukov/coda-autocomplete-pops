Border = PopKit.create({
  onLoad: function(value) {
    this._super();
    
    var parts      = value.match(/(\d+)(?:\w+)?\s+(\w+)\s+(.*)/),
        controller = Border.mainController;
    
    if (parts === null) {
      parts = ["0 solid black", 0, "solid", "black"];
    } else {
      parts[1] = parseInt(parts[1], 10);
    }

    controller.setProperties({
      value:     parts[1] + (parts[1] > 0 ? 9 : 0),
      lineStyle: parts[2],
      color:     parts[3]
    });
    
    Ember.run.next(controller, "updateCodaValue");
  }
});

Border.mainController = Ember.Object.create({
  value: 0,
  lineStyle: "solid",
  color: "black",
  
  realValue: function() {
    var value = this.get("value");
    return value < 10 ? 0 : (value - 9);
  }.property("value").cacheable(),

  _lineStyleDidChange: function() {
    $("select").val(this.get("lineStyle"));
  }.observes("lineStyle"),

  resultString: function() {
    var realValue = this.get("realValue"),
        lineStyle = this.get("lineStyle");
    return realValue + "px " + lineStyle + " " + this.get("color");
  }.property("realValue", "lineStyle", "color").cacheable(),

  updateCodaValue: function() {
    Border.setValue(this.get("resultString"));
  }.observes("resultString"),

  openColorPop: function() {
    var color       = this.get("color"),
        output      = this.get("resultString"),
        colorStart  = output.indexOf(color),
        colorLength = color.length; 

    Coda.openPop("com.panic.pop.colorpicker", "left=179, bottom=8, location=" + colorStart + ", length=" + colorLength);
  }
});

$("select").live("change", function() {
  Border.mainController.set("lineStyle", $(this).val());
});