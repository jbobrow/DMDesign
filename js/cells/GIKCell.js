/**
 * Created by aghassaei on 5/26/15.
 */


define(['underscore', 'three', 'threeModel', 'lattice', 'appState', 'cubeCell'],
    function(_, THREE, three, lattice, appState, CubeCell){

    function GIKCell(json, superCell){
        CubeCell.call(this, json, superCell);
    }
    GIKCell.prototype = Object.create(CubeCell.prototype);

    GIKCell.prototype._getMeshName = function(){
        return null;//never show the gik cell
    };

    GIKCell.prototype.getLength = function(){
        return this.superCell.getLength();
    };

    GIKCell.prototype._initParts = function(callback){
        if (!this.superCell) return;
        var self = this;
        var parts  = [];

        if (lattice.get("partType") == "willLego") {
            require(['gikPart'], function(PartSubclass){
                if (!self.index) return;
                parts.push(new PartSubclass(self.index.x, self));
                callback(parts);
            });
        } else if (lattice.get("partType") == "willLegoLowPoly") {
            require(['gikPartLowPoly'], function(PartSubclass){
                if (!self.index) return;
                parts.push(new PartSubclass(self.index.x, self));
                callback(parts);
            });
        } else if (lattice.get("partType") == "lego") {
            require(['legoPart'], function(PartSubclass){
                if (!self.index) return;
                parts.push(new PartSubclass(self.index.x, self));
                callback(parts);
            });
        } else if (lattice.get("partType") == "dnaLego") {
            require(['dnaLegoPart'], function(PartSubclass){
                if (!self.index) return;
                parts.push(new PartSubclass(self.index.x, self));
                callback(parts);
            });
        } else if (lattice.get("partType") == "dnaStraight") {
            require(['dnaStraightPart'], function(PartSubclass){
                if (!self.index) return;
                var parent = lattice.getUItarget();
                var index = self.getLatticeIndex();
                if (parent.cells[index.x][index.y][index.z+1]) var topNeighbor = parent.cells[index.x][index.y][index.z+1];
                if (parent.cells[index.x][index.y][index.z-1]) var bottomNeighbor = parent.cells[index.x][index.y][index.z-1];
                var seq = this._sequence;
                for (var i=0;i<16;i++){
                    var nucleotide = null;
                    if (seq === undefined){
                        if (topNeighbor && i<8) nucleotide = self.getCompliment(topNeighbor.getNucleotideAtIndex(i+8));
                        if (bottomNeighbor && i>7) nucleotide = self.getCompliment(bottomNeighbor.getNucleotideAtIndex(i-8));
                    } else  nucleotide = seq[i];
                    parts.push(new PartSubclass(self.index.x, self, {
                        nuclType: nucleotide,
                        vertIndex: i,
                        isBridge: false
                    }));
                }
                if (self.getLength() > 1) parts.push(new PartSubclass(self.index.x, self, {isBridge: true}));
                callback(parts);
            });
        }
    };

    GIKCell.prototype.show = function(){
        this.superCell.show();
    };

    GIKCell.prototype.setTransparent = function(){
        this.superCell.setTransparent();
    };

    //todo move this somewhere else
    GIKCell.prototype.propagateConductorGroupNum = function(num){
        if (!this.isConductive()) return;
        if (num === undefined) num = this._eSimConductorGroup;
        var self = this;
        this.superCell._loopCells(function(cell){
            if (cell == self) return;
            cell.setConductorGroupNum(num);
        });
        CubeCell.prototype.propagateConductorGroupNum.call(this, num);
    };

    GIKCell.prototype.propagateStructuralGroupNum = function(num){
        if (num === undefined) num = this._eSimStructuralGroup;
        var self = this;
        this.superCell._loopCells(function(cell){
            if (cell == self) return;
            cell.setStructuralGroupNum(num);
        });
        CubeCell.prototype.propagateStructuralGroupNum.call(this, num);
    };

    return GIKCell;
});