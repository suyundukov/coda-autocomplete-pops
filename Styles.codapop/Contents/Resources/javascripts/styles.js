Styles = PopKit.create({
  
  eventsAttached: false,
  
  onLoad: function(value) {
    this._super();
    
    if (!this.eventsAttached) {
      var self = this;
      $(document).keydown(function(evt) {
        if      (evt.keyCode === 37) { self.leftArrow(); return false; }
        else if (evt.keyCode === 38) { self.upArrow(); return false; }
        else if (evt.keyCode === 39) { self.rightArrow(); return false; }
        else if (evt.keyCode === 40) { self.downArrow(); return false; }
        else if (evt.keyCode === 13) { self.pressedEnter(); return false; }
      });
      
      this.eventsAttached = true;
    }

    Styles.categoriesController.set("selected", Styles.categoriesController.getPath("content.firstObject"));
  },
  
  focusedColumn: "left",
  
  upArrow: function() {
    var controller;
    
    if (this.get("focusedColumn") === "left") {
      controller = Styles.categoriesController;
    } else {
      controller = Styles.stylesController;
    }
    
    var selectedItem = controller.get("selected");
    var idx = controller.indexOf(selectedItem);
    var prevObject;

	if ( idx - 1 < 0 )
	{
		prevObject = controller.get("content").objectAt(controller.get("content").length - 1);
	}
	else
	{
		prevObject = controller.get("content").objectAt(idx-1);	
	}
	
    if (!Em.empty(prevObject)) {
      controller.set("selected", prevObject);
    }
  },
  
  downArrow: function() {
    var controller;
    
    if (this.get("focusedColumn") === "left") {
      controller = Styles.categoriesController;
    } else {
      controller = Styles.stylesController;
    }
  
    var selectedItem = controller.get("selected");
    var idx = controller.indexOf(selectedItem);
	var nextObject;

	if ( idx + 1 > controller.get("content").length - 1 )
		nextObject = controller.get("content").objectAt(0);
	else
     	nextObject = controller.get("content").objectAt(idx+1);
    
    if (!Em.empty(nextObject)) {
      controller.set("selected", nextObject);
    }
  },
  
  leftArrow: function() {
    if (this.get("focusedColumn") === "right") {
      this.set("focusedColumn", "left");
    }
  },
  
  rightArrow: function() {
    if (this.get("focusedColumn") === "left") {
      this.set("focusedColumn", "right");
      
      if (!Styles.stylesController.get("selected")) {
        Styles.stylesController.set("selected", Styles.stylesController.objectAt(0));
      }
    }
  },
  
  pressedEnter: function() {
    if (this.get("focusedColumn") === "right") {
      var selected = Styles.stylesController.get("selected");
      if (selected) {
        Styles.setValue(selected + ": ");
        if (typeof Coda !== "undefined") {
          Coda.closePop();
        }
      }
    }
  }
});

Styles.Category = Em.Object.extend();

Styles.categoriesController = Em.ArrayProxy.create({
  content: styleDefs,
  selected: null,
  
  _selectedDidChange: function() {
    var selectedItem = this.get("selected");
    
    if (!this.get("selected")) { return; }
    
    var idx = this.indexOf(selectedItem);
    var newCategoryOffset = idx * 24;
    var currentTop = $(".categories")[0].scrollTop;
    var viewportHeight = (10 * 24);
    var lastVisible = currentTop + viewportHeight - 24;
    
    if (newCategoryOffset > lastVisible) {
      $(".categories").animate({ scrollTop: (newCategoryOffset - (9 * 24)) }, 200);
    } else if (newCategoryOffset < currentTop) {
      $(".categories").animate({ scrollTop: newCategoryOffset }, 200);
    }
  }.observes("selected")
});

Styles.stylesController = Em.ArrayProxy.create({
  contentBinding: "Styles.categoriesController.selected.styles",
  selected: null,
  
  _contentDidChange: function() {
    this.set("selected", null);
    if ($(".styles").length) {
      $(".styles")[0].scrollTop = 0;
    }
  }.observes("content"),
  
  _selectedDidChange: function() {
    var selectedItem = this.get("selected");
    
    if (!this.get("selected")) { return; }
    
    var idx = this.indexOf(selectedItem);
    var newStyleOffset = idx * 16;
    var currentTop = $(".styles")[0].scrollTop;
    var viewportHeight = (15 * 16);
    var lastVisible = currentTop + viewportHeight - 16;
    
    if (newStyleOffset > lastVisible) {
      $(".styles").animate({ scrollTop: (newStyleOffset - (14 * 16)) }, 200);
    } else if (newStyleOffset < currentTop) {
      $(".styles").animate({ scrollTop: newStyleOffset }, 200);
    }
  }.observes("selected")
});

Styles.CategoryView = Em.View.extend({
  classNameBindings: ["iconClassName", "isSelected"],
  iconClassName: (function() {
    return "" + (this.getPath("content.icon")) + "-icon";
  }).property("content.icon").cacheable(),
  isSelected: (function() {
    return Styles.categoriesController.get("selected") === this.get("content");
  }).property("Styles.categoriesController.selected", "content").cacheable(),
  mouseUp: function() {
    return Styles.categoriesController.set("selected", this.get("content"));
  }
});

Styles.ItemView = Em.View.extend({
  classNameBindings: "isSelected".w(),
  
  isSelected: (function() {
    return Styles.stylesController.get("selected") === this.get("content");
  }).property("Styles.stylesController.selected", "content").cacheable(),

  mouseUp: function() {
    Styles.setValue(this.get("content") + ": ");
    if (typeof Coda !== "undefined") {
      Coda.closePop();
    }
  }
});

Styles.MainView = Em.View.extend({
  classNameBindings: "focusedColumnClass".w(),
  
  focusedColumnBinding: "Styles.focusedColumn",
  focusedColumnClass: function() {
    return "focused-" + this.get("focusedColumn");
  }.property("focusedColumn").cacheable()
});