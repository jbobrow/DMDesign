/**
 * Created by aghassaei on 6/2/15.
 */


define(['underscore', 'backbone', 'threeModel', 'appState', 'lattice', 'cell', 'three', 'highlighter'],
    function(_, Backbone, three, appState, lattice, DMACell, THREE, Highlighter){

    return Highlighter.extend({

        _makeGeometry: function(){
            return new THREE.BoxGeometry(1,1,0.01);
        },

        _setRotation: function(direction){
            this.mesh.rotation.set(direction.y*Math.PI/2, direction.x*Math.PI/2, Math.PI/4);
        }
    });
});