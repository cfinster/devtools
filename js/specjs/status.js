define(function(require, exports, module) {

var _ = require("underscore")._;
var Projects = require("./model").Projects;
var getBugIDandLabel = require("./model").getBugIDandLabel;
require("bigtext");

exports.projects = new Projects($("#projects"));
exports.statusdata = null;

var expander = function() {
    var project = this.project;
    var elem = $(this);
    if (project.expanded) {
        elem.html("&#9654; ");
        $(project.el).find("div.tabs").slideUp();
    } else {
        elem.html("&#9660; ");
        $(project.el).find("div.tabs").slideDown();
    }
    project.expanded = !project.expanded;
};

var addBigText = function() {
    $('.maindate').each(function() {
        var el = $(this);
        var text = el.text();
        el.html("<div>" + text.split(" ").join("</div><div>") + "</div>").bigtext();
    });
    
    $(".status").each(function() {
        var el = $(this);
        var status = el.text().replace(/^\s+|\s+$/,"");
        var statusAbbreviation = status.substring(0, 2).toUpperCase();
        el.html('<div>' + statusAbbreviation + '</div><div>' + status + '</div>');
    }).bigtext();
};

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

var hideTier2 = function() {
    var elem = $('<span/>', {
        html: "&#9654;",
        click: function() {
            var elem = $(this);
            if (this.expanded) {
                elem.html("&#9654;");
                $("#tier2").slideUp();
            } else {
                elem.html("&#9660;");
                $("#tier2").slideDown();
            }
            this.expanded = !this.expanded;
        },
        "class": "expander"
    });
    elem[0].expanded = false;
    $("h2.tier2").prepend(elem);
};

var setupProjectNavigation = function() {
    addBigText();
    augmentProjects();
    hideTier2();
};

var flagMap = {
    "feedback": "&nbsp;f",
    "review": "&nbsp;r",
    "superreview": "sr"
};

var updateBugInformation = function() {
    $.getJSON('status.json?' + new Date().getTime(), function(data) {
        exports.statusdata = data;
        $('span.bug').each(function() {
            var el = $(this);
            var info = getBugIDandLabel(el);
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
            
            outer.append(" " + summary + " (" + bug.assignedName + ") " + bug.whiteboard);
            el.append(outer);
        });
    });
};

if ($('body').hasClass("awesome")) {
    setupProjectNavigation();
    updateBugInformation();
}

exports.jumpToProject = function() {
    var hash = location.hash.substring(1);
    if (!hash) {
        return;
    }
    
    var p = exports.projects[hash];
    if (!p) {
        return;
    }
    
    // scroll to the project
    $('html, body').animate({
        scrollTop: $(p.el).offset().top
    }, 250);
    
    // expand it out
    $("a.expander", p.el).click();
};

});