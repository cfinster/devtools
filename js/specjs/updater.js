define(function(require, exports, module) {

window.model = require("./model");
var backbone = require("backbone");
var file = require("./file");
var _ = require("underscore")._;

window.datadir = localStorage.datadir;

if (datadir) {
    $("#datadir").val(datadir);
}

$("#setdatadir").click(function() {
    window.datadir = $("#datadir").val();
    localStorage.datadir = datadir;
    console.log("datadir saved");
});

$("#generate").click(function() {
    if (!datadir) {
        alert("datadir is not set!");
        return;
    }
    console.log("Loading template");
    $.get("status_template.html", function(template) {
        console.log("Load project list");
        model.loadProjectList(function(pl) {
            console.log("Fetching projects");
            pl.fetchAllProjects(function(pl) {
                var filename = datadir + "/status.html";
                var merged = _.template(template, {pl: pl});
                file.saveFile(filename, merged);
            });
        });
    });
});

});
