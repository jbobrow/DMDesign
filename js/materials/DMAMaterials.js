/**
 * Created by aghassaei on 6/4/15.
 */

//everything is a top level material with a threeMaterial object
define(['underscore', 'three', 'appState', 'lattice', 'plist', 'threeModel'], function(_, THREE, appState, lattice, plist, three){

    var materials = {
        deleteMaterial: {
            color: "#ff0000",
            threeMaterial:new THREE.MeshLambertMaterial({color:"#ff0000", shading:THREE.FlatShading})
        },
        setMaterial: function(id, data){
            if (id && data === null) return deleteMaterial(id);
            if (!materials[id]) materials[id] = {};
            var oldColor = materials[id].color;

            _.each(_.keys(data), function(key){//todo trigger change on all instances
                if (data[key] && data[key].x) materials[id][key] = new THREE.Vector3(data[key].x, data[key].y, data[key].z);
                else materials[id][key] = data[key];
            });

            if (materials[id].threeMaterial || oldColor != materials[id].color) changeSingleMaterialColorScheme(id);
            return false;
        }
    };

    function deleteMaterial(id){
        if (materials[id].noDelete) {
            console.warn("no delete flag on this material type");
            return false;
        }
        delete materials[id];//todo check if being used first
        var deleted = true;
        if (deleted) loadMaterialClass();//set to defaults
        return deleted;
    }

    var listener = {};
    _.extend(listener, Backbone.Events);

    listener.listenTo(appState, "change:realisticColorScheme", changeColorScheme);
    listener.listenTo(appState, "change:materialClass", loadMaterialClass);
    listener.listenTo(lattice, "change:connectionType cellType", loadMaterialClass);
    listener.listenTo(appState, "change:materialType", setMaterialDefaults);

    loadMaterialClass();

    function loadMaterialClass(){
        var materialClass = appState.get("materialClass");
        var newDefaultType = _.keys(plist.allMaterials[materialClass])[0];
        if (!materials[newDefaultType]) _.extend(materials, parseClassFromDefinitions(plist.allMaterials[materialClass]));
        if (!materials[newDefaultType]) console.warn("material type " + newDefaultType + "  not in definition for " + materialClass);
        appState.set("materialType", newDefaultType, {silent:true});//set to default silently
    }

    function parseClassFromDefinitions(definitions){
        var newMaterials = {};
        var state = appState.get("realisticColorScheme");
        _.each(_.keys(definitions), function(key){
            newMaterials[key] = definitions[key];
            var color = getMaterialColorForState(state, definitions[key], key);
            newMaterials[key].threeMaterial = makeMaterialObject(color);
            newMaterials[key].noDelete = true;//don't delete the predefined materials
        });
        return newMaterials;
    }

    function changeColorScheme(){
        var state = appState.get("realisticColorScheme");
        _.each(_.keys(materials), function(name){
            if (name == "setMaterial") return;
            changeSingleMaterialColorScheme(name, state);
        });
        three.render();
    }

    function changeSingleMaterialColorScheme(name, state){
        if (!state) state = appState.get("realisticColorScheme");
        var materialInfo = materials[name];
        var color = getMaterialColorForState(state, materialInfo, name);
        if (materialInfo.threeMaterial) materialInfo.threeMaterial.color = new THREE.Color(color);
        else materialInfo.threeMaterial = makeMaterialObject(color);
    }

    function getMaterialColorForState(state, definition, key){
        var color = definition.color;
        if (!color) console.warn("no color for material type " + key);
        if (!state && definition.altColor) color = definition.altColor;
        return color;
    }

    function makeMaterialObject(color){
        return new THREE.MeshLambertMaterial({color:color, shading:THREE.FlatShading});
    }

    function setMaterialDefaults(){
        var materialType = appState.get("materialType");
        appState.set("superCellIndex", new THREE.Vector3(0,0,0));
        if (materials[materialType].dimensions){
            appState.set("superCellRange", materials[materialType].dimensions.clone());
        } else if (lattice.get("connectionType") == "gik"){
            appState.set("superCellRange", new THREE.Vector3(appState.get("gikLength"), 1, 1));
        }
    }

    return materials;
});