(function() {
  var Person, Project, augmentProjects, exports, flagMap, getBugID, getBugIDandLabel, i, peopleMap, person, personTemplate, project, projectMap, projectNavTemplate, projectTemplate, updateBugInformation, _ref, _ref2, _ref3;
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
  projectNavTemplate = _.template("<div data-id=\"<%= id %>\"><%= name %></div>");
  projectTemplate = _.template("<section class=\"project\" id=\"<%= id %>\">\n    <div class=\"summary\">\n        <div class=\"main\">\n            <div class=\"top\">\n        <h2><a href=\"<%= url %>\"><%= name %></a></h2>\n                <div class=\"counts\">\n                    <span class=\"bugs\"><%= bugs.length %></span>\n                </div>\n                <div class=\"avatars\"></div>\n            </div>\n            <div class=\"bottom\">\n        <div class=\"blurb\"><%= blurb %></div>\n            </div>\n        </div>\n        <div class=\"status\"><%= status %></div>\n    </div>\n    \n    <% if (people) { %>\n        <section class=\"people\">\n            <h3>People</h3>\n            <ul>\n                <% people.forEach(function(person) { %>\n                    <li><%= person %></li>\n                <% }); %>\n            </ul>\n        </section>\n    <% }; %>\n\n    <div class=\"tabs\">\n        <% if (typeof(updates) !== 'undefined' && updates.length > 0) { %>\n            <section>\n                <h3>Updates</h3>\n                <ul>\n                    <% updates.forEach(function(update) { %>\n                        <li><%= update %></li>\n                    <% }); %>\n                </ul>\n            </section>\n        <% }; %>\n        <% if (typeof(bugs) != 'undefined' && bugs.length > 0) { %>\n            <section>\n                <h3>Bugs</h3>\n                <ul>\n                    <% bugs.forEach(function(bug) { %>\n                        <li><span class=\"bug\"><%= bug %></span></li>\n                    <% }); %>\n                </ul>\n            </section>\n        <% }; %>\n</section>");
  personTemplate = _.template("<section class=\"person\">\n    <h3><%= name %></h3>\n    <div><img id=\"avatar-<%= id %>\" alt=\"<%= id %>\" title=\"%<= name %>\" src=\"<%= avatar %>\" class=\"avatar\"></div>\n</section>");
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
    Person.prototype.getAvatar = function() {
      return $("#avatar-" + this.id);
    };
    return Person;
  })();
  exports.Person = Person;
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
  peopleMap = {};
  for (i = 0, _ref3 = people.length; (0 <= _ref3 ? i <= _ref3 : i >= _ref3); (0 <= _ref3 ? i += 1 : i -= 1)) {
    person = new Person(people[i]);
    people[i] = person;
    peopleMap[person.id] = person;
  }
  exports.showProject = function(id) {
    var avatarNode, newImage, newNode, person, _i, _len, _ref;
    if (id === "people") {
      exports.showPeople();
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
      console.log("Person", person);
      console.log("Avatar", person.getAvatar());
      newImage = person.getAvatar().clone();
      console.log("NI", newImage[0]);
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
      contents += personTemplate(person);
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
      return;
    }
    return exports.showProject(hash);
  };
}).call(this);
