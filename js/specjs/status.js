define(function(require, exports, module) {

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

if ($('body').hasClass("awesome")) {
    setupProjectNavigation();
}

});