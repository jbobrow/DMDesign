/**
 * Created by aghassaei on 3/26/15.
 */

//M3 M4 spindle direction (z layer bit 0)
//M8 M9  - coolant on/of (z layer bit 1)
//M5 spindle stop (z layer start)


//spin - z axis go
//wait 1s
//direction - z axis height
//coolant - legs up down



function TinyGExporter(){
    GCodeExporter.call(this);
}
TinyGExporter.prototype = Object.create(GCodeExporter.prototype);

TinyGExporter.prototype.makeHeader = function(){
    return this.goHome();
};

TinyGExporter.prototype._setSpeed = function(speed){
    return "F"+ speed + "\n";
};

TinyGExporter.prototype.goHome = function(){
    return this.addComment("home");
};

TinyGExporter.prototype.engageZAxis = function(type, cellPosition, cell, wcs){
    var data = "";
    if (type == "cell"){
        if (Math.abs(cellPosition.z-wcs.z)<0.001) data += "M3 ";//lower height
        else data += "M4 ";//upper height
        data += this.addComment(JSON.stringify(cell.indices));
    } else if (type == "stock"){
        data += "M8 \n";
    } else {
        console.warn("tinyG type not recognized");
        return "";
    }
    data += "G04 P750\n";//pause for 750 ms
    data += "M5 \n";
    return data
};

TinyGExporter.prototype.simulate = function(line, machine, wcs,  callback){
    var rapidSpeed = dmaGlobals.assembler.get("rapidSpeeds");
    var rapidHeight = dmaGlobals.assembler.get("rapidHeight");
    if (line == "(home)"){
        return machine.moveTo("", "", rapidHeight, rapidSpeed, wcs, callback);
    } else if (line[0]=="M"){
        if (line.substr(0,3) == "M8 "){//get stock
            var stockPosition = dmaGlobals.assembler.get("stockPosition");
            return this.simulateZ(machine, rapidSpeed, wcs, rapidHeight, stockPosition.z-wcs.z, function(){
                machine.pickUpStock();
            }, callback);
        } else if (line.substr(0,3) == "M3 "){//lower height
            //stupid thing needs to do some math to force to float...
            return this.simulateZ(machine, rapidSpeed, wcs, rapidHeight, wcs.z+0.000001, function(){
                machine.releaseStock(line.substr(4, line.length-5));
            }, callback);
        } else if (line.substr(0,3) == "M4 "){//higher height
            return this.simulateZ(machine, rapidSpeed, wcs, rapidHeight, wcs.z+dmaGlobals.lattice.zScale(), function(){
                machine.releaseStock(line.substr(4, line.length-5));
            }, callback);
        } else if (line.substr(0,3) == "M5 ") return callback();
    } else if (line.substr(0,3) == "G04"){
        return callback();
    }
    GCodeExporter.prototype.simulate.call(this, line, machine, wcs, callback);
};

TinyGExporter.prototype.simulateZ = function(machine, rapidSpeed, wcs, rapidHeight, height, action, callback){
    var feedRate = dmaGlobals.assembler.get("feedRate");
    var safeHeight = dmaGlobals.assembler.get("safeHeight");
    return machine.moveTo("", "", height+safeHeight, rapidSpeed, wcs, function(){
        machine.moveTo("", "", height, feedRate, wcs, function(){
            action();
            machine.moveTo("", "", height+safeHeight, feedRate, wcs, function(){
                machine.moveTo("", "", rapidHeight, rapidSpeed, wcs, callback);
            });
        });
    });
};
