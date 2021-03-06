/**
 * Created by aghassaei on 6/2/15.
 */

define(['underscore', 'backbone', 'threeModel', 'appState', 'lattice', 'cell', 'three', 'highlighter'],
    function(_, Backbone, three, appState, lattice, DMACell, THREE, Highlighter){

    return Highlighter.extend({

        _initialize: function(){

            //bind events
            this.listenTo(appState, "change:superCellRange", this._superCellParamDidChange);
            this.listenTo(appState, "change:superCellIndex", this._superCellParamDidChange);
        },

        _makeGeometry: function(){
            return new THREE.BoxGeometry(lattice.xScale(),lattice.yScale(),lattice.zScale());
        },

        _makeWireframe: function(mesh){
//            console.log(mesh);
//            var wireframe = new THREE.BoxHelper(mesh);
//            wireframe.material.color.set(0x000000);
//            wireframe.matrixWorld = mesh.matrixWorld;
//            wireframe.matrixAutoUpdate = true;
//            mesh.add(wireframe);
        },

        _setScale: function(){
            var superCellRange = appState.get("superCellRange");
            this.mesh.scale.set(superCellRange.x, superCellRange.y, superCellRange.z);
        },

        _setPosition: function(position, direction){
            this.mesh.position.set(position.x+lattice.xScale()*direction.x/2, position.y+lattice.yScale()*direction.y/2,
                position.z+lattice.zScale()*direction.z/2);
        },

        _setRotation: function(direction){

            if (lattice._zIndexRotation){
                if (!this.highlightedObject) return;
                var index = this.highlightedObject.getAbsoluteIndex();
                if (Math.abs(direction.z) > 0.9) index.z+=1;
                if (appState._drawingWithCompositeMaterialType()) this.mesh.rotation.set(0,0, lattice._zIndexRotationSuperCell(index));
                else this.mesh.rotation.set(0,0, lattice._zIndexRotation(index));
            }

            var superCellIndex = appState.get("superCellIndex");
            this.mesh.translateX(-(superCellIndex.x + 0.5 - this.mesh.scale.x/2)*lattice.xScale());
            this.mesh.translateY(-(superCellIndex.y + 0.5 - this.mesh.scale.y/2)*lattice.yScale());
            this.mesh.translateZ(-(superCellIndex.z + 0.5 - this.mesh.scale.z/2)*lattice.zScale());
        },

        _superCellParamDidChange: function(){
            if (!this.mesh) return;
            this._setScale();
            if (!this.direction) return;
            this._setPosition(this.position, this.direction);//position of center point
            this._setRotation(this.direction);
            three.render();
        },

        _getNextCellPosition: function(){//add direction vector to current index
            var newIndex = this.highlightedObject.getAbsoluteIndex();
            newIndex.add(this.direction.clone()).round();
            var offset = appState.get("superCellIndex").clone();
            offset.applyQuaternion(this.mesh.quaternion).round();
            newIndex.sub(offset);
            return newIndex;
        }
    });
});