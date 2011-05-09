(function() {
  var Projects, addBugData, checkDataDir, exports, getBugIDandLabel, loadCachedBugData, saveFile;
  exports = specjs.updater = {};
  Projects = specjs.status.Projects;
  getBugIDandLabel = specjs.status.getBugIDandLabel;
  saveFile = function(filePath, content) {
    var file, out;
    console.log("Saving to ", filePath);
    if (window.Components) {
      try {
        console.log("Requesting enhanced privileges");
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        file.initWithPath(filePath);
        if (!file.exists()) {
          file.create(0, 0664);
        }
        out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
        out.init(file, 0x20 | 0x02, 00004, null);
        out.write(content, content.length);
        out.flush();
        out.close();
        console.log("Saved");
        return true;
      } catch (ex) {
        return false;
      }
    }
    return null;
  };
  exports.datadir = null;
  exports.bugList = null;
  exports.bugData = null;
  checkDataDir = function() {
    exports.datadir = $('#datadir').val();
    if (!exports.datadir) {
      alert("Please set the datadir first");
      return false;
    }
    return true;
  };
  exports.attachUI = function() {
    exports.datadir = $('#datadir').val();
    $('#update').click(function() {
      if (!checkDataDir()) {
        return;
      }
      return exports.gatherBugList(exports.saveBugData);
    });
    $('#statusupdate').click(function() {
      if (!checkDataDir()) {
        return;
      }
      if (!exports.bugData) {
        return buggerall.getCachedResult("bugdata.json?" + new Date().getTime(), function(q) {
          exports.bugData = q;
          return exports.generateStatusData();
        });
      } else {
        return exports.generateStatusData();
      }
    });
    return console.log("UI ready");
  };
  exports.gatherBugList = function(callback) {
    var bug, bugIds, project, _i, _j, _len, _len2, _ref;
    bugIds = [];
    for (_i = 0, _len = projects.length; _i < _len; _i++) {
      project = projects[_i];
      if (!project.bugs) {
        return;
      }
      _ref = project.bugs;
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        bug = _ref[_j];
        bugIds.push(getBugIDandLabel(bug).id);
      }
    }
    exports.bugList = _.uniq(bugIds);
    console.log("Bug list from projects.js: ", exports.bugList);
    return callback(exports.bugList);
  };
  exports.saveBugData = function() {
    var q;
    if (!exports.bugList) {
      return;
    }
    q = new buggerall.Query({
      bugid: exports.bugList.join(","),
      whitespace: true,
      includeHistory: true,
      historyCacheURL: "bughistory/"
    });
    console.log("Gathering from bugzilla: ", q.query);
    return q.run(function(q) {
      var bug, bugId, output, _ref, _results;
      console.log("Saving query results");
      exports.bugData = q.result;
      output = q.serialize();
      saveFile(exports.datadir + "/bugdata.json", output);
      _ref = exports.bugData;
      _results = [];
      for (bugId in _ref) {
        bug = _ref[bugId];
        console.log("bug", bug.id, " history", bug.history);
        _results.push(saveFile("" + exports.datadir + "/bughistory/" + bug.id + ".json", bug.history.serialize()));
      }
      return _results;
    });
  };
  addBugData = function(statusdata) {
    var attachment, attachmentId, bug, bugData, bugSummary, bugs, flag, flags, key, patch, queueType, requesteeName, requesteeQueue, reviewQueues, _i, _len, _ref, _ref2, _results;
    bugs = statusdata.bugs;
    reviewQueues = statusdata.reviewQueues;
    bugData = exports.bugData;
    _results = [];
    for (key in bugData) {
      bugSummary = bugs[key] = {};
      bug = bugData[key];
      if (!(bug != null)) {
        throw new Error("Where's the bug data for " + key + "?");
      }
      bugSummary.summary = bug.summary;
      bugSummary.status = bug.status;
      bugSummary.assignedName = bug.assigned_to ? bug.assigned_to.name : null;
      bugSummary.whiteboard = bug.whiteboard;
      bugSummary.hasPatch = false;
      if (bug.attachments != null) {
        _ref = bug.attachments;
        for (attachmentId in _ref) {
          attachment = _ref[attachmentId];
          if (!attachment.is_patch || attachment.is_obsolete || !(attachment.flags != null)) {
            continue;
          }
          _ref2 = attachment.flags;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            flag = _ref2[_i];
            if (flag.status !== "?" || !(flag.requestee != null)) {
              continue;
            }
            requesteeName = flag.requestee.name;
            requesteeQueue = reviewQueues[requesteeName];
            if (!(requesteeQueue != null)) {
              requesteeQueue = reviewQueues[requesteeName] = {};
            }
            queueType = requesteeQueue[flag.name];
            if (!(queueType != null)) {
              queueType = requesteeQueue[flag.name] = {};
              queueType.devtoolsSize = 0;
              queueType.devtoolsCount = 0;
            }
            queueType.devtoolsCount++;
            queueType.devtoolsSize += attachment.size;
          }
        }
      }
      patch = bug.getLatestPatch();
      flags = bugSummary.flags = {};
      flags.feedback = [];
      flags.review = [];
      flags.superreview = [];
      _results.push((function() {
        var _i, _len, _ref, _results;
        if (patch) {
          bugSummary.hasPatch = true;
          bugSummary.patchSize = patch.size;
          if (patch.flags) {
            _ref = patch.flags;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              flag = _ref[_i];
              _results.push(flag.name === "review" || flag.name === "feedback" || flag.name === "superreview" ? flags[flag.name].push({
                status: flag.status,
                requestee: flag.requestee && flag.requestee.name,
                setter: flag.setter && flag.setter.name
              }) : void 0);
            }
            return _results;
          }
        }
      })());
    }
    return _results;
  };
  loadCachedBugData = function() {
    console.log("Reloading cached bugdata");
    return buggerall.getCachedResult("bugdata.json", function(data) {
      console.log("Bugdata retrieved");
      exports.bugData = data;
      return exports.generateStatusData();
    });
  };
  exports.generateStatusData = function() {
    var statusdata;
    statusdata = {
      bugs: {},
      reviewQueues: {}
    };
    if (!exports.bugData) {
      loadCachedBugData();
      return;
    }
    addBugData(statusdata);
    return saveFile(exports.datadir + "/status.json", JSON.stringify(statusdata, null, 1));
  };
}).call(this);
