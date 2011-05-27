(function() {
  var Person, Project, createBugTable, exports, flagMap, formatDefaultBugRow, getBugID, getBugIDandLabel, i, peopleMap, person, personTemplate, project, projectMap, template, templateSettings, _ref, _ref2, _ref3;
  this.specjs = (_ref = this.specjs) != null ? _ref : {};
  this.specjs.status = {};
  exports = this.specjs.status;
  templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g
  };
  template = function(str, data) {
    var c  = templateSettings;
    var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
      'with(obj||{}){__p.push(\'' +
      str.replace(/\\/g, '\\\\')
         .replace(/'/g, "\\'")
         .replace(c.interpolate, function(match, code) {
           return "'," + code.replace(/\\'/g, "'") + ",'";
         })
         .replace(c.evaluate || null, function(match, code) {
           return "');" + code.replace(/\\'/g, "'")
                              .replace(/[\r\n\t]/g, ' ') + "__p.push('";
         })
         .replace(/\r/g, '\\r')
         .replace(/\n/g, '\\n')
         .replace(/\t/g, '\\t')
         + "');}return __p.join('');";
    var func = new Function('obj', tmpl);
    return data ? func(data) : func;
  };;
  getBugID = function(text) {
    return getBugIDandLabel(text).id;
  };
  exports.getBugIDandLabel = getBugIDandLabel = function(text) {
    var match;
    text = text.toString();
    match = /^(bug|)\s*(\d+)\s*(.*)/.exec(text);
    if (!match) {
      return null;
    } else {
      return {
        id: match[2],
        label: match[3]
      };
    }
  };
  personTemplate = template("<section class=\"person\">\n    <h3><%= name %></h3>\n    <div><img id=\"avatar-<%= id %>\" alt=\"<%= id %>\" title=\"%<= name %>\" src=\"<%= avatar %>\" class=\"avatar\"></div>\n</section>");
  Project = (function() {
    function Project(data) {
      var prop, _i, _j, _len, _len2, _ref, _ref2;
      if (!(data != null)) {
        return;
      }
      _ref = ["id", "url", "name", "blurb", "status", "target"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        this[prop] = data[prop] != null ? data[prop] : "";
      }
      _ref2 = ["people", "bugs", "updates", "flags"];
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        prop = _ref2[_j];
        this[prop] = data[prop] != null ? data[prop] : [];
      }
    }
    Project.prototype.getBugIds = function() {
      var bug, _i, _len, _ref, _results;
      _ref = this.bugs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bug = _ref[_i];
        _results.push(getBugID(bug));
      }
      return _results;
    };
    Project.prototype.getPeople = function() {
      var person, result, _i, _len, _ref;
      result = [];
      _ref = this.people;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        person = _ref[_i];
        person = peopleMap[person];
        if (person != null) {
          result.push(person);
        }
      }
      return result;
    };
    Project.prototype.getBugCounts = function() {
      var bd, bug, bugdata, counts, status, _i, _len, _ref;
      counts = {
        open: this.bugs.length,
        withPatches: 0
      };
      if (!(typeof statusdata != "undefined" && statusdata !== null)) {
        return counts;
      }
      bugdata = statusdata.bugs;
      _ref = this.getBugIds();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bug = _ref[_i];
        bd = bugdata[bug];
        if (!bd) {
          continue;
        }
        status = bugdata[bug].status;
        if (status === 'RESOLVED' || status === 'VERIFIED') {
          counts.open--;
          continue;
        }
        if (bugdata[bug].hasPatch) {
          counts.withPatches++;
        }
      }
      return counts;
    };
    return Project;
  })();
  exports.Project = Project;
  Person = (function() {
    function Person(data) {
      var prop, _i, _len, _ref;
      if (!(data != null)) {
        return;
      }
      _ref = ["id", "url", "name", "blurb", "avatar", "status", "bugzillaId"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prop = _ref[_i];
        this[prop] = data[prop] != null ? data[prop] : "";
      }
    }
    Person.prototype.getAvatar = function() {
      return $("#avatar-" + this.id);
    };
    return Person;
  })();
  exports.Person = Person;
  flagMap = {
    "feedback": "&nbsp;f",
    "review": "&nbsp;r",
    "superreview": "sr"
  };
  projectMap = {};
  for (i = 0, _ref2 = projects.length - 1; (0 <= _ref2 ? i <= _ref2 : i >= _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
    project = new Project(projects[i]);
    projects[i] = project;
    projectMap[project.id] = project;
  }
  peopleMap = {};
  for (i = 0, _ref3 = people.length - 1; (0 <= _ref3 ? i <= _ref3 : i >= _ref3); (0 <= _ref3 ? i += 1 : i -= 1)) {
    person = new Person(people[i]);
    people[i] = person;
    peopleMap[person.id] = person;
  }
  formatDefaultBugRow = function(bugStr) {
    return "<tr>\n    <td colspan=\"6\">" + bugStr + "</td>\n</tr>";
  };
  createBugTable = function(project) {
    var bestStatus, bug, bugFlags, bugStr, bugid, buglink, f, flagType, flags, i, info, patchInfo, result, _i, _j, _len, _len2, _len3, _ref, _ref2;
    result = "<section>\n    <h3>Bugs</h3>\n    <table class=\"bugs\">\n        <thead>\n            <tr>\n                <th>#</th>\n                <th>Bug #</th>\n                <th>Patch<br>Status</th>\n                <th>Summary</th>\n                <th>Assigned</th>\n                <th>Whiteboard</th>\n            </tr>\n        </thead>\n        <tbody>";
    _ref = project.bugs;
    for (i = 0, _len = _ref.length; i < _len; i++) {
      bugStr = _ref[i];
      if (!statusdata) {
        result += formatDefaultBugRow(bugStr);
        continue;
      }
      info = getBugIDandLabel(bugStr);
      if (info === null) {
        result += formatDefaultBugRow(bugStr);
        continue;
      }
      bugid = info.id;
      bug = statusdata.bugs[bugid];
      if (!(bug != null)) {
        console.log("Couldn't find data for bug: ", bugid);
        result += formatDefaultBugRow(bugStr);
        continue;
      }
      buglink = "<a class=\"" + (bug.status === "RESOLVED" || bug.status === "VERIFIED" ? "bugid resolved" : "bugid") + "\" href=\"https://bugzilla.mozilla.org/show_bug.cgi?id=" + bugid + "\" target=\"_blank\">" + bugid + "</a>";
      flags = [];
      bestStatus = bug.hasPatch ? "&nbsp;p&nbsp;" : "&nbsp;&nbsp;&nbsp;";
      _ref2 = ["feedback", "review", "superreview"];
      for (_i = 0, _len2 = _ref2.length; _i < _len2; _i++) {
        flagType = _ref2[_i];
        bugFlags = bug.flags[flagType];
        for (_j = 0, _len3 = bugFlags.length; _j < _len3; _j++) {
          f = bugFlags[_j];
          bestStatus = flagMap[flagType] + f.status;
          if (f.requestee) {
            flags.push(flagType + f.status + " " + f.requestee);
          } else {
            flags.push(flagType + f.status + " " + f.setter);
          }
        }
      }
      patchInfo = "<span class=\"patchstatus\" title=\"" + (flags.join(", ")) + "\">" + bestStatus + "</span>";
      result += "<tr>\n    <td>" + (i + 1) + "</td>\n    <td>" + buglink + "</td>\n    <td>" + patchInfo + "</td>\n    <td>" + bug.summary + "</td>\n    <td>" + bug.assignedName + "</td>\n    <td>" + (bug.whiteboard != null ? bug.whiteboard : "") + "</td>\n</tr>";
    }
    return result += "        </tbody>\n    </table>\n</section>";
  };
  exports.showProject = function(id) {
    var avatarNode, newImage, newNode, person, projectStr, update, _i, _j, _k, _len, _len2, _len3, _ref, _ref2;
    if (id === "people") {
      exports.showPeople();
      return;
    } else if (id === "summary") {
      exports.showSummary();
      return;
    }
    $('#content').show();
    $('#people').hide();
    project = projectMap[id];
    projectStr = "<section class=\"project\" id=\"" + project.id + "\">\n    <div class=\"summary\">\n        <div class=\"main\">\n            <div class=\"top\">\n        <h2><a href=\"" + project.url + "\">" + project.name + "</a></h2>\n                <div class=\"counts\">\n                    <span class=\"bugs\">" + project.bugs.length + "</span>\n                </div>\n                <div class=\"avatars\"></div>\n            </div>\n            <div class=\"bottom\">\n        <div class=\"blurb\">" + project.blurb + "</div>\n            </div>\n        </div>\n        <div class=\"status\">" + project.status + "</div>\n    </div>";
    if (project.people) {
      projectStr += "<section class=\"people\">\n    <h3>People</h3>\n    <ul>";
      for (_i = 0, _len = people.length; _i < _len; _i++) {
        person = people[_i];
        projectStr += "<li>" + person + "</li>";
      }
      projectStr += "    </ul>\n</section>";
    }
    projectStr += "<div class=\"tabs\">";
    if ((project.updates != null) && project.updates.length > 0) {
      projectStr += "<section>\n    <h3>Updates</h3>\n    <ul>";
      _ref = project.updates;
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        update = _ref[_j];
        projectStr += "<li>" + update + "</li>";
      }
      projectStr += "    </ul>\n</section>";
    }
    if ((project.bugs != null) && project.bugs.length > 0) {
      projectStr += createBugTable(project);
    }
    projectStr += "</section>";
    newNode = $(projectStr);
    $("table.bugs", newNode).dataTable({
      bPaginate: false,
      bInfo: false
    });
    $("#content").children().remove().append(newNode);
    newNode.appendTo($("#content"));
    $(".status").each(function() {
      var el, status, statusAbbreviation;
      el = $(this);
      status = el.text().replace(/^\s+|\s+$/, "");
      statusAbbreviation = status.substring(0, 2).toUpperCase();
      return el.html('<div>' + statusAbbreviation + '</div><div>' + status + '</div>');
    }).bigtext();
    avatarNode = $('.avatars', newNode);
    _ref2 = project.getPeople();
    for (_k = 0, _len3 = _ref2.length; _k < _len3; _k++) {
      person = _ref2[_k];
      newImage = person.getAvatar().clone();
      newImage.appendTo(avatarNode);
    }
    return location.hash = id;
  };
  exports.showPeople = function() {
    $('#content').hide();
    $('#people').show();
    return location.hash = "#people";
  };
  exports.showSummary = function() {
    var container, content, counts, firstRelease, i, lastRelease, project, release, releases, target, _i, _j, _len, _len2;
    $('#content').show();
    $('#people').hide();
    releases = [];
    firstRelease = Infinity;
    lastRelease = -1;
    for (_i = 0, _len = projects.length; _i < _len; _i++) {
      project = projects[_i];
      target = project.target;
      if (!(target != null) || !target) {
        continue;
      }
      if (!(releases[target] != null)) {
        releases[target] = [];
      }
      releases[target].push(project);
      if (target < firstRelease) {
        firstRelease = target;
      }
      if (target > lastRelease) {
        lastRelease = target;
      }
    }
    if (firstRelease === Infinity || lastRelease === -1) {
      return;
    }
    content = "<section class=\"release_tracking\">\n<h2>Release Tracking</h2>";
    for (i = firstRelease; (firstRelease <= lastRelease ? i <= lastRelease : i >= lastRelease); (firstRelease <= lastRelease ? i += 1 : i -= 1)) {
      release = releases[i];
      if (!(release != null)) {
        continue;
      }
      content += "<h3>Firefox " + i + "</h3>\n<table>\n    <thead>\n        <tr>\n            <th>Feature</th>\n            <th>Status</th>\n            <th>Open Bugs</th>\n            <th>with Patches</th>\n        </tr>\n    </thead>\n    <tbody>";
      for (_j = 0, _len2 = release.length; _j < _len2; _j++) {
        project = release[_j];
        counts = project.getBugCounts();
        content += "<tr><td class=\"project\" data-id=\"" + project.id + "\">" + project.name + "</td><td>" + project.status + "</td><td>" + counts.open + "</td><td>" + counts.withPatches + "</td>";
      }
      content += "</tbody>\n</table>";
    }
    content += "</section>";
    container = $("#content");
    container.children().remove();
    container.append($(content));
    $("td.project", container).click(function(e) {
      return exports.showProject($(e.target).attr("data-id"));
    });
    return location.hash = "#summary";
  };
  exports.populatePage = function() {
    var contents, newNode, peopleNode, person, project, _i, _j, _len, _len2;
    for (_i = 0, _len = projects.length; _i < _len; _i++) {
      project = projects[_i];
      newNode = $("<div data-id=\"" + project.id + "\">" + project.name + "</div>");
      newNode.appendTo($("#nav"));
    }
    peopleNode = $('#people');
    contents = "";
    for (_j = 0, _len2 = people.length; _j < _len2; _j++) {
      person = people[_j];
      try {
        contents += personTemplate(person);
      } catch (e) {
        console.log(e);
      }
    }
    peopleNode.html(contents);
    $('.maindate').each(function() {
      var el, text;
      el = $(this);
      text = el.text();
      return el.html("<div>" + text.split(" ").join("</div><div>") + "</div>").bigtext();
    });
    return $("#nav").click(function(e) {
      return exports.showProject($(e.target).attr("data-id"));
    });
  };
  exports.jumpToProject = function() {
    var hash;
    hash = location.hash.substring(1);
    if (!hash) {
      hash = "summary";
    }
    return exports.showProject(hash);
  };
}).call(this);
