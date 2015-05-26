/**
 * Created by aghassaei on 5/26/15.
 */


_.extend(Lattice, {

    TruncatedCubeLattice: {

        _initLatticeType: function(){
            globals.basePlane = new SquareBasePlane();
            globals.highlighter = new TruncatedCubeHighlighter();
        },

        getIndexForPosition: function(absPosition){
            return this._indexForPosition(absPosition);
        },

        getPositionForIndex: function(index){
            return this._positionForIndex(index);
        },

        xScale: function(){
            return Math.sqrt(2)+2*this.get("cellSeparation").xy;
        },

        yScale: function(){
            return this.xScale();
        },

        zScale: function(){
            return Math.sqrt(2)+2*this.get("cellSeparation").z;
        },

        makeCellForLatticeType: function(indices){
            return new DMATruncCubeCell(indices);
        },

        _undo: function(){//remove all the mixins, this will help with debugging later
            var self = this;
            _.each(_.keys(this.TruncatedCubeLattice), function(key){
                self[key] = null;
            });
        }
    }
});