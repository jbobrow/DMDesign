/**
 * Created by aghassaei on 6/30/15.
 */


define(['jquery', 'underscore', 'menuParent', 'plist', 'text!menus/templates/MStaticMenuView.html'],
    function($, _, MenuParentView, plist, template){

    return MenuParentView.extend({

        events: {
        },

        _initialize: function(){
        },

        _makeTemplateJSON: function(){
            return null;
        },

        template: _.template(template)
    });
});