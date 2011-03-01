define(function(require, exports, module) {

var backbone = require("backbone");
var file = require("./file");

var Project = exports.Project = backbone.Model.extend({
    
});

function datasave() {
    var filename = this.filename;
    if (!datadir) {
        alert("Data directory must be set to save");
        throw new Error("datadir not set");
    }
    file.saveFile(datadir + "/" + filename, JSON.stringify(this.toJSON(), null, 1));
};

function dataview() {
    window.open("data:application/json;base64," + btoa(JSON.stringify(this.toJSON(), null, 1)));
};

var Projects = exports.Projects = backbone.Collection.extend({
    model: Project,
    url: "./"
});

var Person = exports.Person = backbone.Model.extend({
});

var People = exports.People = backbone.Collection.extend({
    model: Person
});

var ProjectList = exports.ProjectList = backbone.Model.extend({
    filename: "projects.json",
    save: datasave,
    viewJSON: dataview
});

exports.loadProjectList = function(callback) {
    $.getJSON("projects.json", function(data) {
        var pl = new ProjectList();
        pl.set({
            projects: data.projects,
            people: new People(data.people)
        });
        
        // handy for interactive use
        if (!callback) {
            window.pl = pl;
        } else {
            callback(pl);
        }
    });
};

});