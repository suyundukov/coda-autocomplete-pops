Dimension = Em.Namespace.create();

Dimension.mainController = Em.Object.create({
  all: 0,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  
  _allDidChange: (function() {
    var all;
    all = this.get("all");
    return this.setProperties({
      top: all,
      right: all,
      bottom: all,
      left: all
    });
  }).observes("all"),
  
  resultString: function() {
    var top    = this.get("top"),
        right  = this.get("right"), 
        bottom = this.get("bottom"),
        left   = this.get("left");
    
    if ((top == right) && (top == bottom) && (top == left)) {
      return top + "px";
    } else if ((top == bottom) && (right == left)) {
      return top + "px " + right + "px";
    } else {
      return top + "px " + right + "px " + bottom + "px " + left  + "px";
    }
  }.property("top", "right", "bottom", "left").cacheable(),
  
  updateCodaValue: function() {
    BorderWidth.setValue(this.get("resultString"));
  }.observes("resultString")
});

Dimension.Row = Em.View.extend({
  templateName: "row",
  classNames:   "row"
});

Dimension.Slider = JUI.Slider.extend({
  min: 0,
  max: 100,
  orientation: 'horizontal'
});

BorderWidth = PopKit.create({
  onLoad: function(value) {
    this._super();
      
    var parts      = value.match(/(\d+)/g),
        controller = Dimension.mainController;
      
    if (parts === null) {
      parts = [0];
    } else {
      for (var i = 0; i < parts.length; i++) {
        parts[i] = parseInt(parts[i], 10);
      }
    }
    
    if (parts.length === 2) {
      controller.setProperties({
        top:    parts[0],
        right:  parts[1],
        bottom: parts[0],
        left:   parts[1]
      });
    } else if (parts.length === 3) {
      controller.setProperties({
        top:    parts[0],
        right:  parts[1],
        bottom: parts[2],
        left:   parts[1]
      });
    } else if (parts.length === 4) { 
      controller.setProperties({
        top:    parts[0],
        right:  parts[1],
        bottom: parts[2],
        left:   parts[3]
      });
    } else {
      controller.set("all", parts[0]);
    }
    
    Ember.run.next(controller, "updateCodaValue");
  }
});