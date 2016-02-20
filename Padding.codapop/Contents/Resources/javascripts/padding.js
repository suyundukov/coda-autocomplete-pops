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
		
	if ( isNaN(all) )
		all = 0;
	
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

	if ( isNaN(top) )
		top = 0;

	if ( isNaN(right) )
		right = 0;

	if ( isNaN(left) )
		left = 0;

	if ( isNaN(bottom) )
		bottom = 0;

    if ((top == right) && (top == bottom) && (top == left)) {
      return top + "px";
    } else if ((top == bottom) && (right == left)) {
      return top + "px " + right + "px";
    } else {
      return top + "px " + right + "px " + bottom + "px " + left  + "px";
    }
  }.property("top", "right", "bottom", "left").cacheable(),

  updateCodaValue: function() {
    Padding.setValue(this.get("resultString"));
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

Padding = PopKit.create({
  onLoad: function(value) {
    this._super();
    
    var parts = value.split(" "),
        controller = Dimension.mainController,
        padding, topPadding, sidePadding;

    if (parts.length === 2) {
      topPadding = parseInt(parts[0], 10);
      sidePadding = parseInt(parts[1], 10);
      controller.set("top", topPadding);
      controller.set("right", sidePadding);
      controller.set("bottom", topPadding);
      controller.set("left", sidePadding);
    } else if (parts.length === 3) {
      topPadding = parseInt(parts[0], 10);
      sidePadding = parseInt(parts[1], 10);
      var bottomPadding = parseInt(parts[2], 10);
      controller.set("top", topPadding);
      controller.set("right", sidePadding);
      controller.set("bottom", bottomPadding);
      controller.set("left", sidePadding);
    } else if (parts.length === 4) {
      controller.set("top", parseInt(parts[0], 10));
      controller.set("right", parseInt(parts[1], 10));
      controller.set("bottom", parseInt(parts[2], 10));
      controller.set("left", parseInt(parts[3], 10));
    } else {
      if ((parts.length === 1) && !Em.empty(parts[0])) {
        padding = parseInt(parts[0], 10);
      } else {
        padding = 0;
      }
	 
      controller.set("all", padding);
    }
    
    Ember.run.next(controller, "updateCodaValue");
  }
});