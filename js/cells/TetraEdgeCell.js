/**
 * Created by aghassaei on 5/26/15.
 */


define(['tetraFaceCell'], function(TetraFaceCell){
    
    function TetraEdgeCell(index, superCell){
        TetraFaceCell.call(this, index, superCell);
    }
    TetraEdgeCell.prototype = Object.create(TetraFaceCell.prototype);
    
    TetraEdgeCell.prototype._rotateCell = function(){};
    
    return TetraEdgeCell;
});