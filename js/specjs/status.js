(function() {
  var Person, Project, exports, flagMap, getBugID, getBugIDandLabel, i, peopleMap, person, personTemplate, project, projectMap, projectNavTemplate, projectTemplate, template, templateSettings, updateBugInformation, _ref, _ref2, _ref3;
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
  projectNavTemplate = template("<div data-id=\"<%= id %>\"><%= name %></div>");
  projectTemplate = template("<section class=\"project\" id=\"<%= id %>\">\n    <div class=\"summary\">\n        <div class=\"main\">\n            <div class=\"top\">\n        <h2><a href=\"<%= url %>\"><%= name %></a></h2>\n                <div class=\"counts\">\n                    <span class=\"bugs\"><%= bugs.length %></span>\n                </div>\n                <div class=\"avatars\"></div>\n            </div>\n            <div class=\"bottom\">\n        <div class=\"blurb\"><%= blurb %></div>\n            </div>\n        </div>\n        <div class=\"status\"><%= status %></div>\n    </div>\n    \n    <% if (people) { %>\n        <section class=\"people\">\n            <h3>People</h3>\n            <ul>\n                <% people.forEach(function(person) { %>\n                    <li><%= person %></li>\n                <% }); %>\n            </ul>\n        </section>\n    <% }; %>\n\n    <div class=\"tabs\">\n        <% if (typeof(updates) !== 'undefined' && updates.length > 0) { %>\n            <section>\n                <h3>Updates</h3>\n                <ul>\n                    <% updates.forEach(function(update) { %>\n                        <li><%= update %></li>\n                    <% }); %>\n                </ul>\n            </section>\n        <% }; %>\n        <% if (typeof(bugs) != 'undefined' && bugs.length > 0) { %>\n            <section>\n                <h3>Bugs</h3>\n                <ul>\n                    <% bugs.forEach(function(bug) { %>\n                        <li><span class=\"bug\"><%= bug %></span></li>\n                    <% }); %>\n                </ul>\n            </section>\n        <% }; %>\n</section>");
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
      var bug, bugdata, counts, status, _i, _len, _ref;
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
      _ref = ["id", "url", "name", "blurb", "avatar", "status"];
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
  updateBugInformation = function() {
    var data;
    if (!(typeof statusdata != "undefined" && statusdata !== null)) {
      return;
    }
    data = statusdata;
    return $('span.bug').each(function() {
      var bestStatus, bug, bugFlags, bugid, el, f, flagType, flags, info, outer, summary, whiteboard, _i, _j, _len, _len2, _ref;
      el = $(this);
      info = getBugIDandLabel(el.text());
      if (info === null) {
        return;
      }
      bugid = info.id;
      bug = data.bugs[bugid];
      if (!(bug != null)) {
        console.log("Couldn't find data for bug: ", bugid);
        return;
      }
      el.empty();
      outer = $('<span/>', {
        "class": "bug"
      });
      $('<a/>', {
        "class": bug.status === "RESOLVED" || bug.status === "VERIFIED" ? "bugid resolved" : "bugid",
        href: "https://bugzilla.mozilla.org/show_bug.cgi?id=" + bugid,
        target: "_blank",
        text: bugid
      }).appendTo(outer);
      flags = [];
      bestStatus = bug.hasPatch ? "&nbsp;p&nbsp;" : "&nbsp;&nbsp;&nbsp;";
      _ref = ["feedback", "review", "superreview"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        flagType = _ref[_i];
        bugFlags = bug.flags[flagType];
        for (_j = 0, _len2 = bugFlags.length; _j < _len2; _j++) {
          f = bugFlags[_j];
          bestStatus = flagMap[flagType] + f.status;
          if (f.requestee) {
            flags.push(flagType + f.status + " " + f.requestee);
          } else {
            flags.push(flagType + f.status + " " + f.setter);
          }
        }
      }
      $('<span/>', {
        "class": "patchstatus",
        title: flags.join(", "),
        html: " " + bestStatus
      }).appendTo(outer);
      summary = info.label || bug.summary;
      whiteboard = bug.whiteboard || "";
      outer.append(" " + summary + " (" + bug.assignedName + ") " + whiteboard);
      return el.append(outer);
    });
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
  exports.showProject = function(id) {
    var avatarNode, newImage, newNode, person, _i, _len, _ref;
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
    newNode = $(projectTemplate(project));
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
    _ref = project.getPeople();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      person = _ref[_i];
      newImage = person.getAvatar().clone();
      newImage.appendTo(avatarNode);
    }
    location.hash = id;
    return updateBugInformation();
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
        content += "<tr><td>" + project.name + "</td><td>" + project.status + "</td><td>" + counts.open + "</td><td>" + counts.withPatches + "</td>";
      }
      content += "</tbody>\n</table>";
    }
    content += "</section>";
    container = $("#content");
    container.children().remove();
    container.append($(content));
    return location.hash = "#summary";
  };
  exports.populatePage = function() {
    var contents, newNode, peopleNode, person, project, _i, _j, _len, _len2;
    for (_i = 0, _len = projects.length; _i < _len; _i++) {
      project = projects[_i];
      newNode = $(projectNavTemplate(project));
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
