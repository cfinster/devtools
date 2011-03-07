define(function(require, exports, module) {

var Projects = require("./model").Projects;

exports.projects = new Projects($("#projects"));
exports.statusdata = null;

var setupProjectNavigation = function() {
    $('section.project').each(function(index, project) {
        var tabnames = [];
        $(project).find("div.tabs section h3").each(function(index) {
            tabnames.push(this.innerHTML);
            $(this).hide();
        });
        var header = '<li><a href="#">';
        var footer = '</a></li>';
        var tabnav = $('<ul class="navigation">' + header + tabnames.join(footer + header) + footer + '<li class="shadow"></li></ul>');
        $(project).find('div.tabs').prepend(tabnav);
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