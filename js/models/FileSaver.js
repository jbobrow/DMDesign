/**
 * Created by aghassaei on 5/25/15.
 */


define(['underscore', 'fileSaverLib', 'lattice'], function(_, saveAs, lattice){

    function _saveFile(data, name, extension){
        var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
        saveAs(blob, name + extension);
    }

//    function save(name){
//        if (!name || name == "" || name == undefined) name = "file";
//        var data = JSON.stringify({
//            lattice:_getLatticeDataToSave(),
////            assembler:_getAssemblerDataToSave()
//        });
//        _saveFile(data, name, ".json");
//    }

    function save(name){
        if (!name || name == "" || name == undefined) name = "DM Assembly";
        var data = JSON.stringify({
            assembly:_getLatticeDataToSave()
        });
        _saveFile(data, name, ".json");
    }

    function saveAssembler(){

    }

    function saveUser(name){
        if (!name || name == "" || name == undefined) name = "user";
        var latticeData = _.omit(_getLatticeDataToSave(), ["cells", "cellsMin", "cellsMax", "numCells"]);
        var assemblerData = _.omit(_getAssemblerDataToSave(), ["dataOut", "needsPostProcessing", "editsMadeToProgram"]);
        var data = JSON.stringify({
            lattice:latticeData,
            assembler:assemblerData
        });
        _saveFile(data, name, ".user");
    }

    function _getAssemblerDataToSave(){
        var assemblerData = _.omit(globals.cam.toJSON(), ["origin", "stock", "exporter", "appState", "lattice", "machine", "simLineNumber"]);
        if (!globals.cam.get("editsMadeToProgram")) assemblerData.dataOut = "";
        return assemblerData;
    }

    function _getLatticeDataToSave(){
        return lattice.getSaveJSON();
    }

    function loadFile(data){//parsed json todo make this better - load composite
        if (!data.assembly){
            console.warn("no assembly in this file");
            return;
        }
        lattice.clearCells();
        var sparseCells = data.assembly.sparseCells;
        _setData(lattice, _.omit(data.assembly, "sparseCells"), false);
        if (sparseCells) lattice._updateLatticeType(sparseCells);
    }

    function loadUser(data){
        _setData(data, false);
    }

    function _setData(object, data, silent){
        _.each(_.keys(data), function(key){
            object.set(key, data[key], {silent:true});
        });
        if (!silent || silent === undefined) object.trigger("change");
    }

    return {//return public methods
//        save: save,
        save: save,
//        saveAssembler: saveAssembler,
//        saveUser: saveUser,
        loadFile: loadFile
//        loadUser: loadUser
    }
});