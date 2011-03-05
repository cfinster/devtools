define(function(require, exports, module) {

exports.Project = function(el) {
    this.el = el;
    this.name = $('h2', el).text();
    $('section h3', el).each(function() {
        var el = $(this);
        if (el.text() == "Bugs") {
            el.next('ul').addClass("buglist");
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
    }
};

exports.Projects = function(el) {
    var self = this;
    $('section.project', el).each(function() {
        var p = new exports.Project(this);
        self[p.name] = p;
    });
};

});