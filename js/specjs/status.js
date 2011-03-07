define(function(require, exports, module) {

var _ = require("underscore")._;
var Projects = require("./model").Projects;

exports.projects = new Projects($("#projects"));
exports.statusdata = null;

var expander = function() {
    var project = this.project;
    var elem = $(this);
    if (project.expanded) {
        elem.html("&#9654;");
        $(project.el).find("section.people,div.tabs").removeClass("visible");
    } else {
        elem.html("&#9660;");
        $(project.el).find("section.people,div.tabs").addClass("visible");
    }
    project.expanded = !project.expanded;
};

var setupProjectNavigation = function() {
    _.values(exports.projects).forEach(function(project) {
        var elem = $('<span/>', {
            html: "&#9654;",
            click: expander,
            "class": "expander"
        });
        project.expanded = false;
        elem[0].project = project;
        $(project.el).find("h2").prepend(elem);
    });
};

var updateBugInformation = function() {
    $.getJSON('status.json?' + new Date().getTime(), function(data) {
        exports.statusdata = data;
        $('ul.buglist li').each(function() {
            var el = $(this);
            var bugid = el.text();
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
            outer.append(" " + bug.summary);
            el.append(outer);
        });
    });
};

if ($('body').hasClass("awesome")) {
    setupProjectNavigation();
    updateBugInformation();
}

});