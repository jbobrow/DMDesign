/**
 * Created by aghassaei on 1/26/15.
 */


CamMenuView = Backbone.View.extend({

    el: "#menuContent",

    events: {
        "click .camProcess":                            "_selectCamProcess",
        "click .units":                                 "_changeUnits",
        "click #saveCam":                               "_save"
    },


    initialize: function(options){

        this.lattice = options.lattice;
        this.assembler = options.assembler;

        _.bindAll(this, "render");
        _.bindAll(this, "_onKeyup");
        //bind events
        this.listenTo(this.assembler, "change", this.render);
        this.listenTo(this.lattice, "change:units", this.render);
        $(document).bind('keyup', {state:false}, this._onKeyup);
    },

    _selectCamProcess: function(e){
        e.preventDefault();
        this.assembler.set("camProcess", $(e.target).data("type"));
    },

    _changeUnits: function(e){
        e.preventDefault();
        this.lattice.set("units", $(e.target).data("type"));
    },

    _onKeyup: function(e){
        if ($(".wcs").is(":focus")) this._updateNumber(e, "originPosition");
        else if ($(".stockPosition").is(":focus")) this._updateNumber(e, "stockPosition");
        else if ($(".rapidSpeeds").is(":focus")) this._updateNumber(e, "rapidSpeeds");
        else if ($(".feedRate").is(":focus")) this._updateNumber(e, "feedRate");
    },

    _updateNumber: function(e, property){
        e.preventDefault();
        var newVal = parseFloat($(e.target).val());
        if (isNaN(newVal)) return;
        var object = this.assembler.get(property);
        object[$(e.target).data("type")] = newVal;
        this.assembler.trigger("change:"+property);
    },

    _save: function(e){
        e.preventDefault();
        this.assembler.save();
    },

    render: function(){
        if (this.model.get("currentTab") != "cam") return;
        if ($("input").is(":focus")) return;
        this.$el.html(this.template(_.extend(this.model.toJSON(), this.assembler.toJSON(), this.lattice.toJSON())));
    },

    template: _.template('\
        CAM output: &nbsp;&nbsp;\
            <div class="btn-group">\
                <button data-toggle="dropdown" class="btn dropdown-toggle" type="button"><%= allCamProcesses[camProcess] %><span class="caret"></span></button>\
                <ul role="menu" class="dropdown-menu">\
                    <% _.each(_.keys(allCamProcesses), function(key){ %>\
                        <li><a class="camProcess" data-type="<%= key %>" href="#"><%= allCamProcesses[key] %></a></li>\
                    <% }); %>\
                </ul>\
            </div><br/><br/>\
         <a href="#" id="saveCam" class=" btn btn-block btn-lg btn-default">Process and Save</a><br/>\
         Units: &nbsp;&nbsp;\
            <div class="btn-group">\
                <button data-toggle="dropdown" class="btn dropdown-toggle" type="button"><%= allUnitTypes[units] %><span class="caret"></span></button>\
                <ul role="menu" class="dropdown-menu">\
                    <% _.each(_.keys(allUnitTypes), function(key){ %>\
                        <li><a class="units" data-type="<%= key %>" href="#"><%= allUnitTypes[key] %></a></li>\
                    <% }); %>\
                </ul>\
            </div><br/><br/>\
            Zero (xyz): &nbsp;&nbsp;<input data-type="x" value="<%= originPosition.x %>" placeholder="X" class="form-control numberInput wcs" type="text">\
            &nbsp;<input data-type="y" value="<%= originPosition.y %>" placeholder="Y" class="form-control numberInput wcs" type="text">\
            &nbsp;<input data-type="z" value="<%= originPosition.z %>" placeholder="Z" class="form-control numberInput wcs" type="text"><br/><br/>\
            Stock (xyz): &nbsp;&nbsp;<input data-type="x" value="<%= stockPosition.x %>" placeholder="X" class="form-control numberInput stockPosition" type="text">\
            &nbsp;<input data-type="y" value="<%= stockPosition.y %>" placeholder="Y" class="form-control numberInput stockPosition" type="text">\
            &nbsp;<input data-type="z" value="<%= stockPosition.z %>" placeholder="Z" class="form-control numberInput stockPosition" type="text"><br/><br/>\
            Rapid Speeds (xy, z): &nbsp;&nbsp;<input data-type="xy" value="<%= rapidSpeeds.xy %>" placeholder="XY" class="form-control numberInput rapidSpeeds" type="text">\
            &nbsp;<input data-type="z" value="<%= rapidSpeeds.z %>" placeholder="Z" class="form-control numberInput rapidSpeeds" type="text"><br/><br/>\
            Feed Rate (xy, z): &nbsp;&nbsp;<input data-type="xy" value="<%= feedRate.xy %>" placeholder="XY" class="form-control numberInput feedRate" type="text">\
            &nbsp;<input data-type="z" value="<%= feedRate.z %>" placeholder="Z" class="form-control numberInput feedRate" type="text">\
        ')

});