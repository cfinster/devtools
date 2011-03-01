define(function(require, exports, module) {

var backbone = require("backbone");
var file = require("./file");
var _ = require("underscore")._;

var originalSync = backbone.sync;
backbone.sync = function(method, model, success, error) {
    if (method == "read") {
        originalSync(method, model, success, error);
        return;
    }
    if (method == "delete") {
        error({model: model, method: method, message: "Delete is not supported"});
        return;
    }
    
    if (!datadir) {
        alert("datadir is not set!");
        error({model: model, method: method, message: "datadir is not set"});
        return;
    }
    
    var filename = model.filename;
    if (!filename) {
        alert("filename is not set!");
        error({model: model, method: method, message: "filename is not set"});
        return;
    }
    file.saveFile(datadir + "/" + filename, JSON.stringify(model.toJSON(), null, 1));
    success({model: model, method: method});
};

function dataview() {
    window.open("data:application/json;base64," + btoa(JSON.stringify(this.toJSON(), null, 1)));
};

var stages = ["Planning", "Prototype", "Active Development", "Alpha", "Beta", "RC", "Released"];

var Project = exports.Project = backbone.Model.extend({
    defaults: {
        bugs: [],
        people: [],
        events: [],
        repositories: [],
        stage: "Planning"
    }
});

var Person = exports.Person = backbone.Model.extend({
});

var People = exports.People = backbone.Collection.extend({
    model: Person
});

var ProjectList = exports.ProjectList = backbone.Model.extend({
    filename: "projects.json",
    viewJSON: dataview,
    _projects: {},
    fetchProject: function(projectName, callback) {
        var project = this._projects[projectName];
        if (project) {
            if (callback) {
                callback(project);
            }
            return;
        }
        project = new Project();
        project.url = projectName + ".json";
        project.id = projectName;
        project.filename = project.url;
        var self = this;
        project.fetch({
            success: function(project) {
                self._projects[projectName] = project;
                if (callback) {
                    callback(project);
                }
            }
        });
    },
    
    fetchAllProjects: function(callback) {
        var loading = _.clone(this.get("projects"));
        this.get("projects").forEach(function(projectName) {
            this.fetchProject(projectName, function(project) {
                var i = loading.indexOf(projectName);
                loading.splice(i, 1);
                if (loading.length == 0) {
                    if (callback) {
                        callback(this);
                    }
                } else {
                    console.log("Done with ", projectName, " waiting on:");
                    console.log(loading);
                }
            });
        }.bind(this));
    },
    
    getProject: function(projectName) {
        return this._projects[projectName];
    }
});

var projectlist = null;

exports.loadProjectList = function(callback) {
    if (projectlist) {
        if (callback) {
            callback(projectlist);
            return;
        }
        window.pl = projectlist;
        return;
    }
    $.getJSON("projects.json", function(data) {
        var pl = new ProjectList();
        projectlist = pl;
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