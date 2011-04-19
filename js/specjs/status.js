(function() {
  var Person, Project, augmentProjects, exports, flagMap, getBugID, getBugIDandLabel, i, project, projectMap, updateBugInformation, _ref, _ref2;
  this.specjs = (_ref = this.specjs) != null ? _ref : {};
  this.specjs.status = {};
  exports = this.specjs.status;
  getBugID = function(text) {
    return getBugIDandLabel(text).id;
  };
  exports.getBugIDandLabel = getBugIDandLabel = function(text) {
    var match;
    text = text.toString();
    match = /^(bug|)\s*(\d+)\s*(.*)/.exec(text);
    if (!match) {
      return null;
    }
    return {
      id: match[2],
      label: match[3]
    };
  };
  Project = (function() {
    function Project(data) {
      this.data = data;
      _.extend(this, {
        id: "",
        url: "",
        name: "",
        blurb: "",
        stauts: "",
        people: [],
        bugs: [],
        updates: [],
        flags: []
      }, data);
    }
    Project.prototype.getBugIds = function() {
      var bug, _i, _len, _ref, _results;
      _ref = this.bugs;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bug = _ref[_i];
        _results.push(getBugId(bug));
      }
      return _results;
    };
    return Project;
  })();
  exports.Project = Project;
  Person = (function() {
    function Person(data) {
      _.extend(this, {
        id: "",
        name: "",
        avatar: ""
      }, data);
    }
    return Person;
  })();
  exports.Person = Person;
  exports.projects = {};
  augmentProjects = function() {
    var avatars, bottom, bugcount, counts, elem, flagcount, latestUpdates, main, person, project, projel, summary, top, _i, _j, _len, _len2, _ref, _ref2, _results;
    latestUpdates = [];
    _ref = exports.projects;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      project = _ref[_i];
      elem = $('<a/>', {
        html: "&#9654; ",
        click: expander,
        href: "#" + project.id,
        "class": "expander"
      });
      project.expanded = false;
      elem[0].project = project;
      $(project.el).find("h2").prepend(elem);
      projel = $(project.el);
      summary = $('<div/>', {
        "class": "summary"
      });
      main = $('<div/>', {
        "class": "main"
      });
      summary.append(main);
      projel.children("div.status").detach().appendTo(summary);
      top = $('<div/>', {
        "class": "top"
      });
      bottom = $('<div/>', {
        "class": "bottom"
      });
      main.append(top);
      main.append(bottom);
      projel.children("h2").detach().appendTo(top);
      counts = $('<div/>', {
        "class": "counts"
      });
      flagcount = project.getFlagCount();
      if (flagcount) {
        $('<span/>', {
          "class": "flags",
          text: flagcount
        }).appendTo(counts);
      }
      bugcount = project.getBugCount();
      $('<span/>', {
        "class": "bugs",
        text: bugcount
      }).appendTo(counts);
      top.append(counts);
      avatars = $('<div/>', {
        "class": "avatars"
      });
      top.append(avatars);
      _ref2 = project.getPeople;
      for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
        person = _ref2[_j];
        $(person.getAvatar()).clone().appendTo(avatars);
      }
      projel.children("div.blurb").detach().appendTo(bottom);
      _results.push(projel.prepend(summary));
    }
    return _results;
  };
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
      bug = data[bugid];
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
  for (i = 0, _ref2 = projects.length; (0 <= _ref2 ? i <= _ref2 : i >= _ref2); (0 <= _ref2 ? i += 1 : i -= 1)) {
    project = new Project(projects[i]);
    projects[i] = project;
    projectMap[project.id] = project;
  }
  exports.showProject = function(id) {
    var newNode;
    project = projectMap[id];
    newNode = $(exports.projectTemplate(project));
    $("#content").children().remove().append(newNode);
    newNode.appendTo($("#content"));
    $(".status").each(function() {
      var el, status, statusAbbreviation;
      el = $(this);
      status = el.text().replace(/^\s+|\s+$/, "");
      statusAbbreviation = status.substring(0, 2).toUpperCase();
      return el.html('<div>' + statusAbbreviation + '</div><div>' + status + '</div>');
    }).bigtext();
    location.hash = id;
    return updateBugInformation();
  };
  exports.populatePage = function() {
    var newNode, project, projectNavTemplate, _i, _len;
    exports.projectTemplate = _.template(document.getElementById("project_template").innerHTML);
    exports.personTemplate = _.template(document.getElementById("person_template").innerHTML);
    projectNavTemplate = _.template(document.getElementById("project_nav_template").innerHTML);
    for (_i = 0, _len = projects.length; _i < _len; _i++) {
      project = projects[_i];
      newNode = $(projectNavTemplate(project));
      newNode.appendTo($("#nav"));
    }
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
      return;
    }
    return exports.showProject(hash);
  };
}).call(this);
