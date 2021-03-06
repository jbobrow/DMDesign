/**
 * Created by aghassaei on 5/26/15.
 */

define(['underscore', 'backbone', 'appState', 'globals', 'plist', 'three', 'threeModel'],
    function(_, Backbone, appState, globals, plist, THREE, three){

    var GIKLattice = {

        _initLatticeType: function(){
            require(['squareBaseplane'], function(SquareBasePlane){
                globals.basePlane = new SquareBasePlane();
            });
            require([this.getHighlighterFile()], function(superCellHighlighter){
                globals.highlighter = new superCellHighlighter();
            });
            appState.set("superCellRange", new THREE.Vector3(appState.get("gikLength"), 1, 1));
        },

        getHighlighterFile: function(){
            return "superCellHighlighter";
        },

        getIndexForPosition: function(absPosition){
            return this._indexForPosition(absPosition);
        },

        getPositionForIndex: function(index){
            return this._positionForIndex(index);
        },

        _zIndexRotation: function(index){
            if (index.z%2 == 1) return Math.PI/2;
            return 0;
        },

        _zIndexRotationSuperCell: function(index){
            if (index.z%2 == 1) return Math.PI/2;//todo this goes neg if zIndexRotation rules are opp? need to clear this up eventually
            return 0;
        },

        getCellSubclassFile: function(){
            return "gikSuperCell";
        },

        _undo: function(){//remove all the mixins, this will help with debugging later
            var self = this;
            _.each(_.keys(GIKLattice), function(key){
                self[key] = null;
            });
        }
    };

    return GIKLattice;
});
