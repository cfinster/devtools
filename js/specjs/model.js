define(function(require, exports, module) {

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

exports.getBugIDandLabel = function(spanEl) {
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

exports.Projects = function(el) {
    var self = this;
    $('section.project', el).each(function() {
        var p = new exports.Project(this);
        self[p.id] = p;
    });
};

});