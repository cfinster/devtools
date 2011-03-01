define(function(require, exports, module) {

var privileged = false;

// Adapted from TiddlyWiki

// Returns null if it can't do it, false if there's an error, true if it saved OK
exports.saveFile = function(filePath,content)
{
    console.log("Saving to ", filePath);
	if(window.Components) {
		try {
		    if (!privileged) {
    			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    			privileged = true;
		    }
		    
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filePath);
			if(!file.exists())
				file.create(0,0664);
			var out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			out.init(file,0x20|0x02,00004,null);
			out.write(content,content.length);
			out.flush();
			out.close();
			console.log("Saved");
			return true;
		} catch(ex) {
			return false;
		}
	}
	return null;
};


});