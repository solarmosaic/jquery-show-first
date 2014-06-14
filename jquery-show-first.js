jQuery(function($) {

  /**
   * Show the first N items in a group and hide the rest, with an option to control.
   */
  $.fn.showFirst = function(options) {
    var $group = $(this);
    var showFirst = new ShowFirst($group, options);
    showFirst.init();
    return showFirst;
  };

  var defaults = {
    controlTemplate: '<li><a href="#" class="show-first-control">Show More</a></li>',
    count: 10,
    hasControl: true
  };

  /**
   * Construct a new ShowFirst object.
   */
  function ShowFirst($group, options)
  {
    // Handle arguments.
    this.$group = $group;
    this.settings = $.extend( {}, defaults, options );

    // Set other properties.
    this.$items = this.$group.children();
    this.hasSurplus = this.$items.length > this.settings.count;

    if (this.hasSurplus) {
      this.indexStartOfRest = this.settings.count;
      this.$itemsFirst = this.$items.slice(0, this.indexStartOfRest);
      this.$itemsRest = this.$items.slice(this.indexStartOfRest);
    }
  }

  /**
   * Initialize behavior.
   */
  ShowFirst.prototype.init = function() {
    if (this.hasSurplus) {
      this.$itemsRest.hide();

      if (this.settings.hasControl) {
        this.addControl();
      }
    }
  };

  ShowFirst.prototype.addControl = function() {
    // Replace tokens in control template.
    var tokens = [
      {pattern: new RegExp("\\[TOTAL_COUNT\\]", "g"), value: this.$items.length},
      {pattern: new RegExp("\\[FIRST_COUNT\\]", "g"), value: this.$itemsFirst.length},
      {pattern: new RegExp("\\[REST_COUNT\\]", "g"), value: this.$itemsRest.length}
    ];
    this.controlWithValues = this.settings.controlTemplate;
    for (var i = 0; i < tokens.length; i++) {
      this.controlWithValues = this.controlWithValues.replace(tokens[i].pattern, tokens[i].value);
    }

    // Insert control.
    this.$controlHtml = $(this.controlWithValues);
    this.$itemsFirst.last().after(this.$controlHtml);

    // Customize control behavior.
    $(".show-first-control", this.$controlHtml).click($.proxy(function(event) {
      event.preventDefault();
      this.$controlHtml.toggle();
      this.$itemsRest.toggle();
    }, this));
  };

  // Automatically create Show First elements based on class and data attributes.
  $(".show-first").each(function() {
    var $group = $(this);
    var options = {};
    options.controlTemplate = $group.data("show-first-control-template");
    options.count = $group.data("show-first-count");
    options.hasControl = $group.data("show-first-has-control");
    $group.showFirst(options);
  });
});