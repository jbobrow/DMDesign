/**
 * Created by aghassaei on 2/25/15.
 */

define(['jquery', 'underscore', 'menuParent', 'camPlist', 'cam', 'lattice', 'materials', 'text!menus/templates/AssemblerMenuView.html'],
    function($, _, MenuParentView, camPlist, cam, lattice, materials, template){

    return MenuParentView.extend({
    
        events: {
        },
    
        _initialize: function(){
    
            _.bindAll(this, "_onKeyup");
            this.listenTo(cam, "change", this.render);//todo handle this in wrapper
            $(document).bind('keyup', {}, this._onKeyup);
        },

        getPropertyOwner: function($target){
            if ($target.hasClass("assembler")) return cam;
            if ($target.hasClass("machine")) return plist.allMachines[cam.get("machineName")];
            return null;
        },
    
        _onKeyup: function(e){
            if (this.model.get("currentTab") != "assembler") return;
            if ($(".placementOrder").is(":focus")) this._updatePlacementOrder(e);
        },
    
        _updatePlacementOrder: function(e){
            e.preventDefault();
            var newVal = $(e.target).val();
            if (newVal.length<3) return;//todo this isn't quite right
            cam.set("placementOrder", newVal);
        },

        _makeTemplateJSON: function(){
            var assembler = cam.get("assembler");
            if (assembler)  assembler = assembler.basicJSON();
            else assembler = camPlist.allMachines[cam.get("machineName")];
            return _.extend(this.model.toJSON(), {thisAssembler: assembler}, cam.toJSON(), lattice.toJSON(), camPlist, {materials:materials.list});
        },
    
        template: _.template(template)
    });
});