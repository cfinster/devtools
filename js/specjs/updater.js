define(function(require, exports, module) {

var Projects = require("./model").Projects;
var _ = require("underscore")._;
var file = require("./file");
var buggerall = require("buggerall/index");

exports.datadir = null;
exports.bugList = null;
exports.bugData = null;

exports.attachUI = function() {
    exports.datadir = $('#datadir').val();
    $('#datadir').change(function() {
        exports.datadir = $(this).val();
    });
    
    $('#update').click(function() {
        if (!exports.datadir) {
            alert("Please set the datadir first");
            return;
        }
        exports.gatherBugList(exports.saveBugData);
    });
    
    $('#statusupdate').click(function() {
        if (!exports.datadir) {
            alert("Please set the datadir first");
            return;
        }
        if (!exports.bugData) {
            buggerall.getCachedResult("bugdata.json?" + new Date().getTime(), function(q) {
                exports.bugData = q;
                exports.generateStatusData();
            });
        } else {
            exports.generateStatusData();
        }
    });
    console.log("UI ready");
};

var projectsHeader = "<!-- projects follow -->";
var projectsFooter = "<!-- end of projects -->";

exports.gatherBugList = function(callback) {
    $.get('status.html?' + new Date().getTime(), function(text) {
        var headerLocation = text.indexOf(projectsHeader);
        var footerLocation = text.indexOf(projectsFooter);
        if (headerLocation == -1 || footerLocation == -1) {
            alert("Could not find the projects section of status.html!");
            return;
        }
        text = text.substring(headerLocation + projectsHeader.length, 
            footerLocation);
        var projects = new Projects($(text));
        exports.projects = projects;
        var bugIds = [];
        _.values(projects).forEach(function(project) {
            project.getBugIds().forEach(function(id) {
                bugIds.push(id);
            });
        });
        exports.bugList = _.uniq(bugIds);
        console.log("Bug list from status.html: ", exports.bugList);
        callback(exports.bugList);
    });
};

exports.saveBugData = function() {
    if (!exports.bugList) {
        return;
    }
    var q = new buggerall.Query({
        bugid: exports.bugList.join(","),
        whitespace: true
    });
    console.log("Gathering from bugzilla: " + q.query);
    q.run(function(q) {
        exports.bugData = q.result;
        var output = q.serialize();
        file.saveFile(exports.datadir + "/bugdata.json", output);
    });
};

exports.generateStatusData = function() {
    var statusdata = {
        bugs: {}
    };
    var bugs = statusdata.bugs;
    var bugData = exports.bugData;
    Object.keys(bugData).forEach(function(key) {
        var bugSummary = bugs[key] = {};
        var bug = bugData[key];
        bugSummary.summary = bug.summary;
        bugSummary.status = bug.status;
        bugSummary.assignedName = bug.assigned_to ? bug.assigned_to.name : null;
        bugSummary.whiteboard = bug.whiteboard;
        bugSummary.hasPatch = false;
        
        var patch = bug.getLatestPatch();
        var flags = bugSummary.flags = {};
        flags.feedback = [];
        flags.review = [];
        flags.superreview = [];
        if (patch) {
            bugSummary.hasPatch = true;
            bugSummary.patchSize = patch.size;
            if (patch.flags) {
                patch.flags.forEach(function(flag) {
                    if (flag.name == "review" || flag.name == "feedback" 
                        || flag.name == "superreview") {
                        flags[flag.name].push({
                            status: flag.status,
                            requestee: flag.requestee && flag.requestee.name,
                            setter: flag.setter && flag.setter.name
                        });
                    }
                });
            }
        }
    });
    file.saveFile(exports.datadir + "/status.json", JSON.stringify(bugs, null, 1));
};

});
