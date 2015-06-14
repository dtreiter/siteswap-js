var ControlsView = Backbone.View.extend({
    defaults: {
        numBalls: 4,
        maxHeight: 12,
        period: 3,
        limit: 100
    },

    el: "#controls",

    template: _.template($("#controls-view").html()),

    initialize: function() {
        this.numBalls = this.defaults.numBalls;
        this.maxHeight = this.defaults.maxHeight;
        this.period = this.defaults.period;
        this.limit = this.defaults.limit;
        this.render();
    },

    events: {
        "click #controls-submit": "generate",
        "change #num-balls": "changeNumBalls",
        "change #max-height": "changeMaxHeight",
        "change #period": "changePeriod"
    },

    render: function() {
        var template = this.template({
            numBalls: this.numBalls,
            maxHeight: this.maxHeight,
            period: this.period
        });
        this.$el.html(template);
    },

    /* TODO There shouldn't be so many changeFoo's. */
    changeNumBalls: function(e) {
        this.numBalls = parseInt($(e.currentTarget).val());
    },

    changeMaxHeight: function(e) {
        this.maxHeight = parseInt($(e.currentTarget).val());
    },

    changePeriod: function(e) {
        this.period = parseInt($(e.currentTarget).val());
    },

    generate: function() {
        var siteswaps = generator.generateSwaps(this.numBalls, this.maxHeight, this.period, this.limit);
        var collection = siteswaps.map(function(siteswap) {
            return {pattern: siteswap};
        });
        /* TODO Decouple this. */
        patterns.reset(collection);
    }
});

/* TODO Move these globals elsewhere. */
var controls = new ControlsView();


var defaultSiteswaps = [
    {pattern: "744"},
    {pattern: "567891234"},
    {pattern: "97531"},
    {pattern: "645"}
];

var patterns = new Backbone.Collection(defaultSiteswaps);

var SiteswapView = Backbone.View.extend({
    tagName: "li",

    className: "siteswap-row",

    events: {
        "click": "animatePattern"
    },

    template: _.template($("#siteswap-view").html()),

    initialize: function(options) {
        this.pattern = options.pattern;
        _.bindAll(this, 'render', 'animatePattern');
        this.render();
    },

    render: function() {
        var template = this.template({ "pattern": this.pattern });
        this.$el.html(template);
    },

    animatePattern: function() {
        animator.setPattern(this.pattern);
    }
});

var SiteswapListView = Backbone.View.extend({
    collection: patterns,

    el: "#siteswaps-list",

    initialize: function() {
        // TODO Rerender when collection changes.
        this.listenTo(this.collection, 'reset', this.render, this);
        this.render();
    },

    render: function() {
        this.$el.empty();
        this.collection.each(function(model) {
            var view = new SiteswapView({
                pattern: model.attributes.pattern
            });
            this.$el.append(view.el);
        }, this);
    }
});

var listview = new SiteswapListView();
