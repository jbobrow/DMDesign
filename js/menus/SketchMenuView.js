/**
 * Created by aghassaei on 1/26/15.
 */


SketchMenuView = Backbone.View.extend({

    el: "#menuContent",

    events: {
    },

    initialize: function(options){

        this.appState = options.appState;

        _.bindAll(this, "render");

    },

    render: function(){
        if (this.appState.get("currentTab") != "sketch") return;
        this.$el.html(this.template());
    },

    template: _.template('\
        sketch and extrude commands\
        ')

});