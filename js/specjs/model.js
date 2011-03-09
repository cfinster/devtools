define(function(require, exports, module) {

exports.Project = function(el) {
    this.el = el;
    this.name = $('h2', el).text();
    $('section h3', el).each(function() {
        var el = $(this);
        if (el.text() == "Bugs") {
            el.next('ul').addClass("buglist");
        } else if (el.text() == "Flags") {
            el.next('ul').addClass('flaglist');
        }
    });
};

exports.Project.prototype = {
    getBugIds: function() {
        var result = [];
        $("ul.buglist li", this.el).each(function() {
            result.push($(this).text());
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
        return $(this.el).find('ul.buglist li').length;
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
        console.log("Project found: ", p.name);
        self[p.name] = p;
    });
};

});