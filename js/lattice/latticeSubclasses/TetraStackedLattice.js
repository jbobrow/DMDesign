/**
 * Created by aghassaei on 6/4/15.
 */

define(['underscore', 'backbone', 'appState', 'globals', 'plist', 'three', 'threeModel'],
    function(_, Backbone, appState, globals, plist, THREE, three){

    var TetraStackedLattice = {

        _initLatticeType: function(){
            require(['octaBaseplane'], function(OctaBasePlane){
                globals.basePlane = new OctaBasePlane();
            });
            require([this.getHighlighterFile()], function(DefaultHighlighter){
                globals.highlighter = new DefaultHighlighter();
            });
        },

        getHighlighterFile: function(){
            return "defaultHighlighter";
        },

        getIndexForPosition: function(absPosition){
            var index = this._indexForPosition(absPosition);
            if (index.y%2 != 0) {
                absPosition.x += this.xScale()/2;
                index = this._indexForPosition(absPosition);
            }
            return index;
        },

        getPositionForIndex: function(index){
            var position = this._positionForIndex(index);
            if ((index.y%2) != 0) position.x -= this.xScale()/2;
            return position;
        },

        getCellSubclassFile: function(){
            return "tetraStackedCell";
        },

        _undo: function(){//remove all the mixins, this will help with debugging later
            var self = this;
            _.each(_.keys(TetraStackedLattice), function(key){
                self[key] = null;
            });
        }
    };

    return TetraStackedLattice;
});
