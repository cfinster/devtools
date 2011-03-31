(function(win) {

var specjs = win.specjs;
if (!specjs) {
    specjs = win.specjs = {};
}

var exports = specjs.status = {};

exports.Project = function(el) {
    this.el = el;
    this.name = $('h2', el).text();
    this.id = el.getAttribute("id");
    $('section h3', el).each(function() {
        var el = $(this);
        if (el.text() == "Bugs") {
            el.next('ul').addClass("buglist");
        } else if (el.text() == "Flags") {
            el.next('ul').addClass('flaglist');
        } else if (el.text() == "Updates") {
            // el.next("ul").addCLass("updatelist");
        }
    });
};

var getBugIDandLabel = exports.getBugIDandLabel = function(spanEl) {
    if (typeof(spanEl) == "string" || typeof(spanEl) == "number") {
        completeText = spanEl.toString();
    } else {
        var completeText = $(spanEl).text();
    }
    var match = /^(bug|)\s*(\d+)\s*(.*)/.exec(completeText);
    if (!match) {
        return null;
    }
    return {
        id: match[2],
        label: match[3]
    };
};

exports.Project.prototype = {
    getBugIds: function() {
        var result = [];
        $("span.bug", this.el).each(function() {
            var info = exports.getBugIDandLabel(this);
            if (info == null) {
                return;
            }
            result.push(info.id);
        });
        return result;
    },
    
    getPeople: function() {
        var result = [];
        $(this.el).find("section.people ul li").each(function() {
            var personid = $(this).text();
            var personEl = document.getElementById(personid);
            if (!personEl) {
                console.log("Unknown person: ", personid);
                return;
            }
            result.push(new exports.Person(personEl));
        });
        return result;
    },
    
    getFlagCount: function() {
        return $(this.el).find('ul.flaglist li').length;
    },
    
    getBugCount: function() {
        return $(this.el).find('span.bug').length;
    },
    
    getUpdates: function() {
        return $(this.el).find("ul.updatelist li").map(function() {
            var dateStr = $(this).find("span.date").text();
            if (dateStr) {
                return [Date.parse(dateStr), this.innerHTML];
            } else {
                return [0, this.innerHTML];
            }
        });
    }
};

exports.Person = function(el) {
    this.el = el;
};

exports.Person.prototype = {
    getAvatar: function() {
        return $(this.el).find("img.avatar")[0];
    }
};

var Projects = exports.Projects = function(el) {
    var self = this;
    $('section.project', el).each(function() {
        var p = new exports.Project(this);
        self[p.id] = p;
    });
};

var defaultProject = {
    id: "",
    url: "",
    name: "",
    blurb: "",
    stauts: "",
    people: [],
    bugs: [],
    updates: []
};

var defaultPerson = {
    id: "",
    name: "",
    avatar: ""
};

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
            var whiteboard = bug.whiteboard || "";
            
            outer.append(" " + summary + " (" + bug.assignedName + ") " + whiteboard);
            el.append(outer);
        });
    });
};

if ($('body').hasClass("awesome")) {
    var projectTemplate = _.template(document.getElementById("project_template").innerHTML);
    var personTemplate = _.template(document.getElementById("person_template").innerHTML);

    projects.forEach(function(project) {
        var base = _.clone(defaultProject);
        project = _.extend(base, project);
        var newNode = $(projectTemplate(project));
        newNode.appendTo($("#projects"));
    });

    people.forEach(function(person) {
        var base = _.clone(defaultPerson);
        person = _.extend(base, person);
        var newNode = $(personTemplate(person));
        $("#people").append(newNode);
    });

    exports.projects = new Projects($("#projects"));
    exports.statusdata = null;

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

})(this);