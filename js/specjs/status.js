(function(win) {

var specjs = win.specjs;
if (!specjs) {
    specjs = win.specjs = {};
}

var exports = specjs.status = {};

var Project = exports.Project = function(data) {
    _.extend(this, {
        id: "",
        url: "",
        name: "",
        blurb: "",
        stauts: "",
        people: [],
        bugs: [],
        updates: [],
        flags: []
    }, data);
};

var getBugIDandLabel = exports.getBugIDandLabel = function(text) {
    text = text.toString();
    var match = /^(bug|)\s*(\d+)\s*(.*)/.exec(text);
    if (!match) {
        return null;
    }
    return {
        id: match[2],
        label: match[3]
    };
};

var getBugID = function(text) {
    return getBugIDandLabel(text).id;
};

exports.Project.prototype = {
    getBugIds: function() {
        return this.bugs.map(getBugID);
    }
};

exports.Person = function(data) {
    _.extend(this, {
        id: "",
        name: "",
        avatar: ""
    }, data);
};

exports.projects = {};

var augmentProjects = function() {
    var latestUpdates = [];
    _.values(exports.projects).forEach(function(project) {
        var elem = $('<a/>', {
            html: "&#9654; ",
            click: expander,
            href: "#" + project.id,
            "class": "expander"
        });
        project.expanded = false;
        elem[0].project = project;
        $(project.el).find("h2").prepend(elem);
        
        var projel = $(project.el);
        
        var summary = $('<div/>', {
            "class": "summary"
        });
        var main = $('<div/>', {
            "class": "main"
        });
        summary.append(main);
        projel.children("div.status").detach().appendTo(summary);
        
        var top = $('<div/>', {
            "class": "top"
        });
        var bottom = $('<div/>', {
            "class": "bottom"
        });
        main.append(top);
        main.append(bottom);
        projel.children("h2").detach().appendTo(top);
        
        var counts = $('<div/>', {
            "class": "counts"
        });
        
        var flagcount = project.getFlagCount();
        if (flagcount) {
            $('<span/>', {
                "class": "flags",
                text: flagcount
            }).appendTo(counts);
        }
        
        var bugcount = project.getBugCount();
        $('<span/>', {
            "class": "bugs",
            text: bugcount
        }).appendTo(counts);
        
        top.append(counts);
        
        var avatars = $('<div/>', {
            "class": "avatars"
        });
        top.append(avatars);
        
        project.getPeople().forEach(function(person) {
            $(person.getAvatar()).clone().appendTo(avatars);
        });
        
        projel.children("div.blurb").detach().appendTo(bottom);
        projel.prepend(summary);
    });
};

var flagMap = {
    "feedback": "&nbsp;f",
    "review": "&nbsp;r",
    "superreview": "sr"
};

var updateBugInformation = function() {
    if (typeof(statusdata) == "undefined") {
        return;
    }
    var data = statusdata;
    $('span.bug').each(function() {
        var el = $(this);
        var info = getBugIDandLabel(el.text());
        if (info == null) {
            return;
        }
        var bugid = info.id;
        var bug = data[bugid];
        if (!bug) {
            console.log("Couldn't find data for bug: ", bugid);
            return;
        }
        el.empty();
        var outer = $('<span/>', {
            "class": "bug"
        });
        $('<a/>', {
            "class": bug.status == "RESOLVED" ? "bugid resolved" : "bugid",
            href: "https://bugzilla.mozilla.org/show_bug.cgi?id=" + bugid,
            target: "_blank",
            text: bugid
        }).appendTo(outer);
        var flags = [];
        var bestStatus = bug.hasPatch ? "&nbsp;p&nbsp;" : "&nbsp;&nbsp;&nbsp;";
        ["feedback", "review", "superreview"].forEach(function(flagType) {
            var bugFlags = bug.flags[flagType];
            bugFlags.forEach(function(f) {
                bestStatus = flagMap[flagType] + f.status;
                if (f.requestee) {
                    flags.push(flagType + f.status + " " + f.requestee);
                } else {
                    flags.push(flagType + f.status + " " + f.setter);
                }
            });
        });
        $('<span/>', {
            "class": "patchstatus",
            title: flags.join(", "),
            html: " " + bestStatus
        }).appendTo(outer);
        
        var summary = info.label || bug.summary;
        var whiteboard = bug.whiteboard || "";
        
        outer.append(" " + summary + " (" + bug.assignedName + ") " + whiteboard);
        el.append(outer);
    });
};

var projectMap = {};

for (var i = 0; i < projects.length; i++) {
    var project = new Project(projects[i]);
    projects[i] = project;
    projectMap[project.id] = project;
};

exports.showProject = function(id) {
    var project = projectMap[id];
    var newNode = $(exports.projectTemplate(project));
    $("#content").children().remove().append(newNode);
    newNode.appendTo($("#content"));
    $(".status").each(function() {
        var el = $(this);
        var status = el.text().replace(/^\s+|\s+$/,"");
        var statusAbbreviation = status.substring(0, 2).toUpperCase();
        el.html('<div>' + statusAbbreviation + '</div><div>' + status + '</div>');
    }).bigtext();
    location.hash = id;
    updateBugInformation();
};

exports.populatePage = function() {
    exports.projectTemplate = _.template(document.getElementById("project_template").innerHTML);
    exports.personTemplate = _.template(document.getElementById("person_template").innerHTML);
    var projectNavTemplate = _.template(document.getElementById("project_nav_template").innerHTML);
    projects.forEach(function(project) {
        var newNode = $(projectNavTemplate(project));
        newNode.appendTo($("#nav"));
    });
    $('.maindate').each(function() {
        var el = $(this);
        var text = el.text();
        el.html("<div>" + text.split(" ").join("</div><div>") + "</div>").bigtext();
    });
    $("#nav").click(function(e) {
        exports.showProject($(e.target).attr("data-id"));
    });
};

exports.jumpToProject = function() {
    var hash = location.hash.substring(1);
    if (!hash) {
        return;
    }
    
    exports.showProject(hash);
};

})(this);