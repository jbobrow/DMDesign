/**
 * Created by aghassaei on 3/10/15.
 */

Assembler = Backbone.Model.extend({

    defaults: {
        camStrategy: "raster",
        placementOrder: "XYZ",//used for raster strategy entry
        camProcess: "gcode",
        machineName: "handOfGod",
        machine: null,
        exporter: null,

        dataOut: "",
        needsPostProcessing: true,
        editsMadeToProgram: false,//warn the user that they will override changes

        rapidHeight: 6,//always store relative to origin
        rapidHeightRelative: true,
        safeHeight: 0.5,//inches above stock or assembly, when feed rate should slow

        origin: null,
        originPosition: new THREE.Vector3(20,0,0),//in abs coordinates
        stock: null,
        stockPosition: new THREE.Vector3(20,0,0),//in abs coordinates
        stockPositionRelative: true,
        multipleStockPositions: false,
        stockArraySize: {x:4, y:4},
        stockSeparation: 2.78388,

        rapidSpeeds:{xy: 3, z: 2},//rapids at clearance height
        feedRate:{xy: 0.1, z: 0.1},//speed when heading towards assembly

        simLineNumber: 0,//used for stock simulation, reading through gcode
        simSpeed: 4,//#X times real speed
    },

    initialize: function(options){

        this.selectMachine();

        _.bindAll(this, "postProcess");

        //bind events
        this.listenTo(options.appState, "change:currentTab", this._tabChanged);
        this.listenTo(this, "change:originPosition", this._moveOrigin);
        this.listenTo(this, "change:stockPosition", this._moveStock);
        this.listenTo(this,
                "change:originPosition " +
                "change:stockPosition " +
                "change:feedRate " +
                "change:rapidSpeeds " +
                "change:camProcess " +
                "change:camStrategy " +
                "change:placementOrder " +
                "change:safeHeight " +
                "change:stockArraySize " +
                "change:stockSeparation " +
                "change:multipleStockPositions " +
                "change:rapidHeight " +
                "change:machineName",
            this._setNeedsPostProcessing);
        this.listenTo(options.lattice,
                "change:numCells " +
                "change:units " +
                "change:scale " +
                "change:cellType " +
                "change:connectionType",
            this._setNeedsPostProcessing);
        this.listenTo(options.lattice, "change:scale", this._setCAMScale);
        this.listenTo(dmaGlobals.appState, "change:stockSimulationPlaying", this._stockSimulation);

        this.listenTo(options.lattice, "change:partType", this._updatePartType);
        this.listenTo(options.lattice, "change:cellType change:connectionType", this._updateCellType);
        this.listenTo(options.appState, "change:cellMode", this._updateCellMode);
        this.listenTo(this, "change:machineName", this.selectMachine);

        this._initOriginAndStock();
    },

    selectMachine: function(){
        var machineName = this.get("machineName");
        if (this.get("machine")) this.get("machine").destroy();
        if (machineName == "shopbot"){
            this.set("machine", new Shopbot());
            this.set("camProcess", "shopbot");
        } else if (machineName == "handOfGod"){
            this.set("machine", new God());
            this.set("camProcess", "gcode");
            this.set("originPosition", {x:0,y:0,z:0});
            this.set("stockPosition", {x:0,y:0,z:50});//todo calculate a good stock position
        } else if (machineName == "oneBitBot"){
            this.set("machine", new OneBitBot());
            this.set("camProcess", "gcode");
        } else console.warn("selected machine not recognized");
    },

    makeProgramEdits: function(data){
        this.set("dataOut", data, {silent:true});
        this.set("editsMadeToProgram", true, {silent: true});
    },

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////VISUALIZATION//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

    isVisible: function(){
        var currentTab = dmaGlobals.appState.get("currentTab");
        return (currentTab == "cam" || currentTab == "animate" || currentTab == "send");
    },

    _updateCellType: function(){
        this.get("machine").updateCellType();
        this.set("machineName", "handOfGod");//todo this should go away with dynamic allocation of this model

    },

    _updatePartType: function(){
        this.get("machine").updatePartType();
    },

    _updateCellMode: function(){
        this.get("machine").setVisibility(this.isVisible());
        dmaGlobals.three.render();
    },

    _setCAMScale: function(){
        var scale = dmaGlobals.lattice.get("scale")/8;
        this.get("origin").scale.set(scale, scale, scale);
        this.get("stock").scale.set(scale, scale, scale);
    },

    _tabChanged: function(){
        this._setCAMVisibility();
        if (dmaGlobals.appState.get("currentTab") != "animate") this.resetSimulation();
    },

    _setCAMVisibility: function(){
        var visible = this.isVisible();
        this.get("origin").visible = visible;
        this.get("stock").visible = visible;
        this.get("machine").setVisibility(visible);
        dmaGlobals.three.render();
    },

    _initOriginAndStock: function(){//todo this is ugly
        var origin = new THREE.Mesh(new THREE.SphereGeometry(1),
            new THREE.MeshBasicMaterial({color:0xff0000}));
        dmaGlobals.three.sceneAdd(origin);
        this.set("origin", origin);
        this._moveOrigin();
        //init stock mesh
        var stock = new THREE.Mesh(new THREE.SphereGeometry(1),
            new THREE.MeshBasicMaterial({color:0xff00ff}));
        dmaGlobals.three.sceneAdd(stock);
        this.set("stock", stock);
        this._moveStock();
        this._setCAMScale();
        this._setCAMVisibility();
    },

    _moveOrigin: function(){
        var position = this.get("originPosition");
        this.get("origin").position.set(position.x, position.y, position.z);
        if (this.get("stockPositionRelative")) this._updateStockPosToOrigin(position);
        dmaGlobals.three.render();
        if (this.get("machine").setMachinePosition) this.get("machine").setMachinePosition();
    },

    _updateStockPosToOrigin: function(newOrigin){
        var lastOrigin = this.previous("originPosition");
        var newStockPosition = _.clone(this.get("stockPosition"));
        _.each(_.keys(newStockPosition), function(key){
            newStockPosition[key] += newOrigin[key] - lastOrigin[key];
            newStockPosition[key] = parseFloat(newStockPosition[key].toFixed(4));
        });
        this.set("stockPosition", newStockPosition);
    },

    _moveStock: function(){
        var position = this.get("stockPosition");
        this.get("stock").position.set(position.x, position.y, position.z);
        dmaGlobals.three.render();
    },

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////SIMULATION//////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

    resetSimulation: function(){
        this.set("simLineNumber", 0, {silent:true});
        dmaGlobals.appState.set("stockSimulationPlaying", false);
        dmaGlobals.three.stopAnimationLoop();
        dmaGlobals.lattice.showCells();
    },

    _stockSimulation: function(){
        if (dmaGlobals.appState.get("stockSimulationPlaying")){
            dmaGlobals.three.startAnimationLoop();
            var currentLine = this.get("simLineNumber");
            if (currentLine == 0) dmaGlobals.lattice.hideCells();
            var allLines = this.get("dataOut").split("\n");
            if(currentLine<allLines.length){
                var self = this;
                this.get("exporter").simulate(allLines[currentLine], this.get("machine"),
                    this.get("originPosition"), function(){
                    currentLine++;
                    self.set("simLineNumber", currentLine);
                    self._stockSimulation();
                });
            } else {
                //finished simulation
                this.resetSimulation();
            }
        } else {
            dmaGlobals.three.stopAnimationLoop();
            this.get("machine").pause();
        }

    },

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////POST PROCESSING////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

    _setNeedsPostProcessing: function(){
        this.set("needsPostProcessing", true);
    },

    postProcess: function(){
        this.set("needsPostProcessing", false);
        var exporter = this._getExporter();

        var data = "";
        data += exporter.makeHeader();
        data += "\n\n";
        data += exporter.addComment("begin program");
        data += "\n";

        data = this.get("machine").postProcess(data, exporter);

        data += "\n\n";
        data += exporter.addComment("end program");
        data += "\n";
        data += exporter.makeFooter();

        this.set("dataOut", data);
        this.set("editsMadeToProgram", false);
        this.set("exporter", exporter);
        this.resetSimulation();
        return {data:data, exporter:exporter};
    },

    _getExporter: function(){
        var currentExporter = this.get("exporter");
        if (this.get("camProcess") == "shopbot") {
            if (currentExporter && currentExporter.constructor == ShopbotExporter){
                return currentExporter;
            } else {
                return new ShopbotExporter();
            }
        } else if (this.get("camProcess") == "gcode") {
            if (currentExporter && currentExporter.constructor == GCodeExporter){
                return currentExporter;
            } else {
                return new GCodeExporter();
            }
        }
        console.warn("cam process not supported");
        return null;
    },

    _getOrder: function(strategy){
        if (strategy == "raster") return this.get("placementOrder");
        console.warn("strategy not recognized");
        return "";
    },

    save: function(){
        if (this.get("needsPostProcessing")){
            var output = this.postProcess();
            output.exporter.save(output.data);
            return;
        }
        this.get("exporter").save(this.get("dataOut"));
    }

});