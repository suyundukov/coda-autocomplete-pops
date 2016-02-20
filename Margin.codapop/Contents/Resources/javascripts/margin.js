Dimension = Em.Namespace.create();

function selfOrNeg1(v) {
  return isNaN(v) ? -1 : v;
}

Dimension.mainController = Em.Object.create({
  all:    0,
  top:    0,
  left:   0,
  right:  0,
  bottom: 0,
  
  _allDidChange: (function() {
    var all = this.get("all");
    this.setProperties({
      top:    all,
      right:  all,
      bottom: all,
      left:   all
    });
  }).observes("all"),

  resultString: function() {
    var top    = this.get("top"),
        right  = this.get("right"), 
        bottom = this.get("bottom"),
        left   = this.get("left");

    top    = (top === -1)    ? "auto"    : top + "px";
    right  = (right === -1)  ? "auto"  : right + "px";
    bottom = (bottom === -1) ? "auto" : bottom + "px";
    left   = (left === -1)   ? "auto"   : left + "px";
    
    if ((top === right) && (top === bottom) && (top === left)) {
      return top;
    } else if ((top === bottom) && (right === left)) {
      return top + " " + right;
    } else {
      return top + " " + right + " " + bottom + " " + left;
    }
  }.property("top", "right", "bottom", "left").cacheable(),

  updateCodaValue: function() {
    Margin.setValue(this.get("resultString"));
  }.observes("resultString")
});

Dimension.Row = Em.View.extend({
  templateName: "row",
  classNames: "row"
});

Dimension.Slider = JUI.Slider.extend({
  min: 0,
  max: 100,
  orientation: 'horizontal'
});

Margin = PopKit.create({
  onLoad: function(value) {
    this._super();

    var parts = value.split(" "),
        controller = Dimension.mainController,
        margin, topMargin, sideMargin, bottomMargin;

    if (parts.length === 2) {
      topMargin  = parseInt(parts[0], 10);
      sideMargin = parseInt(parts[1], 10);
      
      controller.setProperties({
        top:    selfOrNeg1(topMargin),
        right:  selfOrNeg1(sideMargin),
        bottom: selfOrNeg1(topMargin),
        left:   selfOrNeg1(sideMargin)
      });
    } else if (parts.length === 3) {
      topMargin    = parseInt(parts[0], 10);
      sideMargin   = parseInt(parts[1], 10);
      bottomMargin = parseInt(parts[2], 10);
      controller.setProperties({
        top:    selfOrNeg1(topMargin),
        right:  selfOrNeg1(sideMargin),
        bottom: selfOrNeg1(bottomMargin),
        left:   selfOrNeg1(sideMargin)
      });
    } else if (parts.length === 4) {
      topMargin        = parseInt(parts[0], 10);
      var rightMargin  = parseInt(parts[1], 10);
      bottomMargin     = parseInt(parts[2], 10);
      var leftMargin   = parseInt(parts[3], 10);
      
      controller.setProperties({
        top:    selfOrNeg1(topMargin),
        right:  selfOrNeg1(rightMargin),
        bottom: selfOrNeg1(bottomMargin),
        left:   selfOrNeg1(leftMargin)
      });
    } else {
      if ((parts.length === 1) && !Em.empty(parts[0])) {
        margin = parseInt(parts[0], 10);
        margin = selfOrNeg1(margin);
      } else {
        margin = 0;
      }

      controller.set("all", margin);
    }
    
    Ember.run.next(controller, "updateCodaValue");
  }
});