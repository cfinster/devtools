define(function(require, exports, module) {

$(".bug").each(function(index, elem) {
  var bugNumber = elem.innerHTML;
  var lastSpace = bugNumber.lastIndexOf(" ");
  if (lastSpace > -1) {
    bugNumber = bugNumber.substring(lastSpace + 1);
  }
  elem.setAttribute("href", "https://bugzilla.mozilla.org/show_bug.cgi?id=" + bugNumber);
  elem.setAttribute("target", "_blank");
});

});
