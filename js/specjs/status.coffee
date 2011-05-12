# manages the status page

@specjs = @specjs ? {}

@specjs.status = {}

exports = @specjs.status

# Underscore's templates pulled in for convenience.
# By default, Underscore uses ERB-style template delimiters, change the
# following template settings to use alternative delimiters.
templateSettings =
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g

# JavaScript micro-templating, similar to John Resig's implementation.
# Underscore templating handles arbitrary delimiters, preserves whitespace,
# and correctly escapes quotes within interpolated code.
template = `function(str, data) {
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
  };`

getBugID = (text) ->
    getBugIDandLabel(text).id

exports.getBugIDandLabel = getBugIDandLabel = (text) ->
    text = text.toString()
    match = /^(bug|)\s*(\d+)\s*(.*)/.exec text
    
    if !match then null else {
        id: match[2]
        label: match[3]
    }

projectNavTemplate = template """<div data-id="<%= id %>"><%= name %></div>"""

projectTemplate = template """
    <section class="project" id="<%= id %>">
        <div class="summary">
            <div class="main">
                <div class="top">
            <h2><a href="<%= url %>"><%= name %></a></h2>
                    <div class="counts">
                        <span class="bugs"><%= bugs.length %></span>
                    </div>
                    <div class="avatars"></div>
                </div>
                <div class="bottom">
            <div class="blurb"><%= blurb %></div>
                </div>
            </div>
            <div class="status"><%= status %></div>
        </div>
        
        <% if (people) { %>
            <section class="people">
                <h3>People</h3>
                <ul>
                    <% people.forEach(function(person) { %>
                        <li><%= person %></li>
                    <% }); %>
                </ul>
            </section>
        <% }; %>

        <div class="tabs">
            <% if (typeof(updates) !== 'undefined' && updates.length > 0) { %>
                <section>
                    <h3>Updates</h3>
                    <ul>
                        <% updates.forEach(function(update) { %>
                            <li><%= update %></li>
                        <% }); %>
                    </ul>
                </section>
            <% }; %>
            <% if (typeof(bugs) != 'undefined' && bugs.length > 0) { %>
                <section>
                    <h3>Bugs</h3>
                    <ul>
                        <% bugs.forEach(function(bug) { %>
                            <li><span class="bug"><%= bug %></span></li>
                        <% }); %>
                    </ul>
                </section>
            <% }; %>
    </section>
"""

personTemplate = template """
    <section class="person">
        <h3><%= name %></h3>
        <div><img id="avatar-<%= id %>" alt="<%= id %>" title="%<= name %>" src="<%= avatar %>" class="avatar"></div>
    </section>
"""

class Project
    constructor: (data) ->
        if not data?
            return
        for prop in ["id", "url", "name", "blurb", "status", "target"]
            @[prop] = if data[prop]? then data[prop] else ""
        for prop in ["people", "bugs", "updates", "flags"]
            @[prop] = if data[prop]? then data[prop] else []

    getBugIds: () ->
        getBugID bug for bug in @bugs
    
    getPeople: () ->
        result = []
        for person in @people
            person = peopleMap[person]
            if person?
                result.push person
        result
    
    getBugCounts: () ->
        counts = 
            open: @bugs.length
            withPatches: 0
        
        if not statusdata?
            return counts
        
        bugdata = statusdata.bugs
        for bug in @getBugIds()
            status = bugdata[bug].status
            if status == 'RESOLVED' or status == 'VERIFIED'
                counts.open--
                continue
            if bugdata[bug].hasPatch
                counts.withPatches++
        
        counts

exports.Project = Project

class Person
    constructor: (data) ->
        if not data?
            return
        for prop in ["id", "url", "name", "blurb", "avatar", "status"]
            @[prop] = if data[prop]? then data[prop] else ""
    
    getAvatar: () ->
        $ "#avatar-#{@id}"

exports.Person = Person

flagMap = 
    "feedback": "&nbsp;f"
    "review": "&nbsp;r"
    "superreview": "sr"

updateBugInformation = () ->
    return if not statusdata?
    
    data = statusdata
    
    $('span.bug').each(() ->
        el = $(this);
        info = getBugIDandLabel el.text()
        return if info == null
        
        bugid = info.id
        bug = data.bugs[bugid]
        if not bug?
            console.log "Couldn't find data for bug: ", bugid
            return
        
        el.empty()
        
        outer = $('<span/>', {
            "class": "bug"
        })
        $('<a/>', {
            class: if bug.status == "RESOLVED" or bug.status == "VERIFIED" then "bugid resolved" else "bugid"
            href: "https://bugzilla.mozilla.org/show_bug.cgi?id=" + bugid
            target: "_blank"
            text: bugid
        }).appendTo(outer)
        flags = []
        bestStatus = if bug.hasPatch then "&nbsp;p&nbsp;" else "&nbsp;&nbsp;&nbsp;"
        for flagType in ["feedback", "review", "superreview"]
            bugFlags = bug.flags[flagType]
            for f in bugFlags
                bestStatus = flagMap[flagType] + f.status
                if f.requestee
                    flags.push flagType + f.status + " " + f.requestee
                else
                    flags.push flagType + f.status + " " + f.setter
        
        $('<span/>', {
            "class": "patchstatus"
            title: flags.join(", ")
            html: " " + bestStatus
        }).appendTo(outer)
        
        summary = info.label || bug.summary
        whiteboard = bug.whiteboard || ""
        
        outer.append(" " + summary + " (" + bug.assignedName + ") " + whiteboard)
        el.append outer
    )

projectMap = {}

for i in [0..projects.length-1]
    project = new Project(projects[i])
    projects[i] = project
    projectMap[project.id] = project

peopleMap = {}

for i in [0..people.length-1]
    person = new Person(people[i])
    people[i] = person
    peopleMap[person.id] = person

exports.showProject = (id) ->
    if id == "people"
        exports.showPeople()
        return
    else if id == "summary"
        # summary turned off for now due to breakage
        exports.showSummary()
        return
    
    $('#content').show()
    $('#people').hide()
    project = projectMap[id]
    newNode = $(projectTemplate(project))
    $("#content").children().remove().append(newNode)
    newNode.appendTo($("#content"))
    $(".status").each(() ->
        el = $(this)
        status = el.text().replace(/^\s+|\s+$/,"")
        statusAbbreviation = status.substring(0, 2).toUpperCase()
        el.html('<div>' + statusAbbreviation + '</div><div>' + status + '</div>')
    ).bigtext()

    avatarNode = $ '.avatars', newNode
    for person in project.getPeople()
        newImage = person.getAvatar().clone()
        newImage.appendTo(avatarNode)

    location.hash = id
    updateBugInformation()

exports.showPeople = () ->
    $('#content').hide()
    $('#people').show()
    location.hash = "#people"
    
exports.showSummary = () ->
    $('#content').show()
    $('#people').hide()
    releases = []
    firstRelease = Infinity
    lastRelease = -1
    for project in projects
        target = project.target
        if not target? or not target
            continue
        if not releases[target]?
            releases[target] = []
        releases[target].push(project)
        firstRelease = target if target < firstRelease
        lastRelease = target if target > lastRelease
    
    if firstRelease == Infinity or lastRelease == -1
        return


    content = """<section class="release_tracking">
<h2>Release Tracking</h2>
"""
    for i in [firstRelease..lastRelease]
        release = releases[i]
        if not release?
            continue
        content += """<h3>Firefox #{i}</h3>
<table>
    <thead>
        <tr>
            <th>Feature</th>
            <th>Status</th>
            <th>Open Bugs</th>
            <th>with Patches</th>
        </tr>
    </thead>
    <tbody>
"""
        for project in release
            counts = project.getBugCounts()
            content += """
        <tr><td class="project" data-id="#{project.id}">#{project.name}</td><td>#{project.status}</td><td>#{counts.open}</td><td>#{counts.withPatches}</td>
"""
        content += """
    </tbody>
</table>
"""
    
    content += """
</section>
"""
    container = $("#content")
    container.children().remove()
    container.append($(content))

    $("td.project", container).click (e) ->
        exports.showProject($(e.target).attr("data-id"))

    location.hash = "#summary"

exports.populatePage = () ->
    for project in projects
        newNode = $(projectNavTemplate(project))
        newNode.appendTo($("#nav"))
    
    peopleNode = $ '#people'

    contents = ""
    for person in people
        try 
            contents += personTemplate(person)
        catch e
            console.log e
    
    peopleNode.html contents

    $('.maindate').each () ->
        el = $(this)
        text = el.text()
        el.html("<div>" + text.split(" ").join("</div><div>") + "</div>").bigtext()
    
    $("#nav").click (e) ->
        exports.showProject($(e.target).attr("data-id"))
    
    
exports.jumpToProject = () ->
    hash = location.hash.substring(1)
    if not hash
        hash = "summary"
    
    exports.showProject hash
