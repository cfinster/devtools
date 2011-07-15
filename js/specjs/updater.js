(function() {
  var BugDataCollector, Projects, addBugData, checkDataDir, exports, getBugIDandLabel, loadCachedBugData, saveFile;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  exports = specjs.updater = {};
  Projects = specjs.status.Projects;
  getBugIDandLabel = specjs.status.getBugIDandLabel;
  saveFile = function(filePath, content) {
    var file, out;
    if (window.Components) {
      try {
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
    return callback(exports.bugList);
  };
  BugDataCollector = (function() {
    function BugDataCollector() {
      this.saveData = __bind(this.saveData, this);;
      this.reviewQueueResult = __bind(this.reviewQueueResult, this);;      this.mainQuery = new buggerall.Query({
        bugid: exports.bugList.join(","),
        whitespace: true,
        includeHistory: true,
        historyCacheURL: "bughistory/"
      });
      this.queryCount = 0;
      this.reviewBugs = [];
    }
    BugDataCollector.prototype.queryDone = function() {
      this.queryCount--;
      console.log("Done with query, remaining: ", this.queryCount);
      if (this.queryCount === 0) {
        return this.gatherReviewBugData();
      }
    };
    BugDataCollector.prototype.run = function() {
      var person, q, _i, _len, _results;
      this.queryCount++;
      console.log("Gathering data from bugzilla");
      this.mainQuery.run(__bind(function(q) {
        console.log("finished with main query");
        return this.queryDone();
      }, this));
      return;
      _results = [];
      for (_i = 0, _len = people.length; _i < _len; _i++) {
        person = people[_i];
        if (person.reviewCheck === false) {
          continue;
        }
        q = new buggerall.Query({
          query: "field0-3-0=requestees.login_name&type0-1-0=notequals&field0-1-0=attachments.isobsolete&field0-0-0=attachments.ispatch&resolution=---&value0-3-0=" + person.bugzillaId + "&query_format=advanced&value0-2-0=review&value0-1-0=1&type0-3-0=equals&field0-2-0=flagtypes.name&type0-0-0=equals&value0-0-0=1&type0-2-0=substring",
          fields: "id"
        });
        console.log("Query: ", q.query);
        this.queryCount++;
        _results.push(q.run(this.reviewQueueResult));
      }
      return _results;
    };
    BugDataCollector.prototype.reviewQueueResult = function(q) {
      var id;
      console.log("Finished with review queue query", this.queryCount);
      for (id in q.result) {
        this.reviewBugs.push(id);
      }
      return this.queryDone();
    };
    BugDataCollector.prototype.gatherReviewBugData = function() {
      var buglist;
      if (this.reviewBugs.length === 0) {
        this.saveData();
        return;
      }
      buglist = _.uniq(this.reviewBugs, false);
      this.reviewQuery = new buggerall.Query({
        bugid: buglist.join(","),
        whitespace: true,
        includeHistory: true,
        historyCacheURL: "bughistory/"
      });
      return this.reviewQuery.run(this.saveData);
    };
    BugDataCollector.prototype.saveData = function() {
      var bug, bugId, output, q, _ref, _ref2, _results;
      console.log("Saving query results");
      q = this.mainQuery;
      _ref = q.result;
      for (bugId in _ref) {
        bug = _ref[bugId];
        bug.devtoolsBug = true;
      }
      if (this.reviewQuery != null) {
        q.merge(this.reviewQuery);
      }
      if (!q.result) {
        console.log("No bugzilla results - not saving");
        return;
      }
      exports.bugData = q.result;
      output = q.serialize();
      saveFile(exports.datadir + "/bugdata.json", output);
      _ref2 = exports.bugData;
      _results = [];
      for (bugId in _ref2) {
        bug = _ref2[bugId];
        _results.push(saveFile("" + exports.datadir + "/bughistory/" + bug.id + ".json", bug.history.serialize()));
      }
      return _results;
    };
    return BugDataCollector;
  })();
  exports.saveBugData = function() {
    var bdc;
    if (!exports.bugList) {
      return;
    }
    console.log("setting up bugzilla collector");
    bdc = new BugDataCollector();
    return bdc.run();
  };
  addBugData = function(statusdata) {
    var attachment, attachmentId, bug, bugData, bugSummary, bugs, data, flag, flags, id, item, key, patch, queueType, requesteeName, requesteeQueue, reviewQueues, toDelete, _i, _j, _len, _len2, _ref, _ref2, _ref3, _results;
    bugs = statusdata.bugs;
    reviewQueues = statusdata.reviewQueues;
    bugData = exports.bugData;
    _results = [];
    for (key in bugData) {
      bug = bugData[key];
      if (!(bug != null)) {
        throw new Error("Where's the bug data for " + key + "?");
      }
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
              queueType.totalSize = 0;
              queueType.totalCount = 0;
            }
            if (bug.devtoolsBug) {
              queueType.devtoolsCount++;
              queueType.devtoolsSize += attachment.size;
            }
            queueType.totalCount++;
            queueType.totalSize += attachment.size;
          }
        }
      }
      toDelete = [];
      for (id in reviewQueues) {
        data = reviewQueues[id];
        if (!((_ref3 = data.review) != null ? _ref3.devtoolsCount : void 0)) {
          toDelete.push(id);
        }
      }
      for (_j = 0, _len2 = toDelete.length; _j < _len2; _j++) {
        item = toDelete[_j];
        delete reviewQueues[item];
      }
      if (!bug.devtoolsBug) {
        continue;
      }
      bugSummary = bugs[key] = {};
      bugSummary.summary = bug.summary;
      bugSummary.status = bug.status;
      bugSummary.assignedName = bug.assigned_to ? bug.assigned_to.name : null;
      bugSummary.whiteboard = bug.whiteboard;
      bugSummary.hasPatch = false;
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
