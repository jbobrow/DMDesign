/**
 * Created by aghassaei on 6/10/15.
 */

define(['jquery', 'underscore', 'menuParent', 'plist', 'lattice', 'globals'], function($, _, MenuParentView, plist, lattice, globals){

    return MenuParentView.extend({

        events: {
            "click #newRandomColor":                                  "_changeRandomColor",
            "click #finishComposite":                                 "_finishComposite",
            "click #saveComposite":                                   "_saveComposite",
            "click #cancelComposite":                                 "_cancelComposite",
            "click #deleteComposite":                                 "_deleteComposite"
        },

        _initialize: function(){

            if (!lattice.compositeEditor) {
                console.warn("no composite editor inited");
                return;
            }
            this.listenTo(lattice.compositeEditor, "change", this.render);
            this.listenTo(lattice, "change", this.render);
        },

        _changeRandomColor: function(e){
            e.preventDefault();
            lattice.compositeEditor._changeRandomColor();
        },

        updateHex: function(hex){
            //update hex without rendering
            $("#compositeColor").css("border-color", hex);
        },

        _finishComposite: function(e){
            e.preventDefault();
            this.stopListening();
            if (!lattice.compositeEditor){
                console.warn("lattice not in composite mode for finish composite call");
                this._exit();
                return;
            }
            lattice.compositeEditor.makeNewCompositeMaterial($("#compositeName").val());
            this._exit();
        },

        _saveComposite: function(e){
            e.preventDefault();
        },

        _cancelComposite: function(e){
            e.preventDefault();
            this._exit();
        },

        _deleteComposite: function(e){
            e.preventDefault();
            if (!lattice.compositeEditor){
                console.warn("lattice not in composite mode for delete composite call");
                this._exit();
                return;
            }
            lattice.compositeEditor.deleteComposite();
            this._exit();
        },

        _exit: function(){
            this.model.set("currentNav", "navDesign");
        },

        _makeTemplateJSON: function(){
            return _.extend(this.model.toJSON(), plist, globals, lattice.compositeEditor.toJSON(),
                {
                    materialClass:lattice.get("materialClass"),
                    materialType:lattice.get("materialType"),
                    dimensions: lattice.compositeEditor.calculateBoundingBox()
                });
        },

        template: _.template('\
            <a href="#" class="btn btn-halfWidth btn-lg btn-default importJSON">Load Composite</a>\
            <a id="saveComposite" href="#" class="btn btn-halfWidth btn-lg pull-right btn-default">Save Composite</a><br/><br/>\
            Name: &nbsp;&nbsp;<input id="compositeName" data-property="name" value="<%= name %>" placeholder="Enter Name" class="seventyFiveWidth form-control textInput compositeEditor" type="text"><br/><br/>\
            Num Cells: &nbsp;&nbsp;<%= numCells %><br/><br/>\
            Bounding Box: &nbsp;&nbsp;<%= dimensions.x %> x <%= dimensions.y %> x <%= dimensions.z %><br/><br/>\
            Display Color: &nbsp;&nbsp;\
            <input id="compositeColor" style="border-color: <%= color %> ;" data-property="color" value="<%= color %>" placeholder="Enter HEX" class="halfWidth compositeEditor form-control hexInput" type="text"><br/><br/>\
            <a id="newRandomColor" href="#" class="btn btn-block btn-lg btn-default">New Random Color</a><br/>\
            Available Materials:<br/>\
            <% _.each(_.keys(allMaterials[materialClass]), function(key){ %>\
            <label class="radio colorSwatches">\
                <input type="radio" <%if (key == materialType){ %>checked<%}%> name="materialType" value="<%= key %>" data-toggle="radio" class="custom-radio lattice"><span class="icons"><span class="icon-unchecked"></span><span class="icon-checked"></span></span>\
                <div class="materialColorSwatch">\
                <div style="background-color:<% if(realisticColorScheme){ %><%= allMaterials[materialClass][key].color %><% }else{ %><%= allMaterials[materialClass][key].altColor %><% } %>"></div>\
                <span><%= allMaterials[materialClass][key].name %></span></div>\
            </label>\
            <% }); %>\
            <% _.each(_.keys(materials.compositeMaterials), function(key){ \
                if (key == id) return; %>\
            <label class="radio colorSwatches">\
                <input type="radio" <%if (key == materialType){ %>checked<%}%> name="materialType" value="<%= key %>" data-toggle="radio" class="custom-radio lattice"><span class="icons"><span class="icon-unchecked"></span><span class="icon-checked"></span></span>\
                <div class="materialColorSwatch">\
                <div style="background-color:<% if(realisticColorScheme){ %><%= materials.compositeMaterials[key].color %><% }else{ %><%= materials.compositeMaterials[key].altColor %><% } %>"></div>\
                <span><%= materials.compositeMaterials[key].name %></span></div>\
            </label>\
            <% }); %><br/>\
            <a id="finishComposite" href="#" class="btn btn-block btn-lg btn-success">Save Composite</a><br/>\
            <a id="cancelComposite" href="#" class="btn btn-halfWidth btn-lg btn-default">Cancel / Exit</a>\
            <a id="deleteComposite" href="#" class="btn btn-halfWidth pull-right btn-lg btn-default"><span class="fui-trash"></span> Delete</a><br/>\
            ')

    });
});