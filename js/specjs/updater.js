define(function(require, exports, module) {

window.model = require("./model");
var backbone = require("backbone");

window.datadir = localStorage.datadir;

if (datadir) {
    $("#datadir").val(datadir);
}

$("#setdatadir").click(function() {
    window.datadir = $("#datadir").val();
    localStorage.datadir = datadir;
    console.log("datadir saved");
});

});
