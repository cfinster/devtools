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
            bd = bugdata[bug]
            if not bd
                continue
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
        for prop in ["id", "url", "name", "blurb", "avatar", "status", "bugzillaId"]
            @[prop] = if data[prop]? then data[prop] else ""
    
    getAvatar: () ->
        $ "#avatar-#{@id}"

exports.Person = Person

flagMap = 
    "feedback": "&nbsp;f"
    "review": "&nbsp;r"
    "superreview": "sr"

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

formatDefaultBugRow = (bugStr) ->
    """
                            <tr>
                                <td colspan="6">#{bugStr}</td>
                            </tr>
"""


createBugTable = (project) ->
    result = """
            <section>
                <h3>Bugs</h3>
                <table class="bugs">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Bug #</th>
                            <th>Patch<br>Status</th>
                            <th>Summary</th>
                            <th>Assigned</th>
                            <th>Whiteboard</th>
                        </tr>
                    </thead>
                    <tbody>
"""
    for bugStr, i in project.bugs
        if not statusdata
            result += formatDefaultBugRow bugStr
            continue
        info = getBugIDandLabel bugStr
        if info == null
            result += formatDefaultBugRow bugStr
            continue
        
        bugid = info.id
        bug = statusdata.bugs[bugid]
        if not bug?
            console.log "Couldn't find data for bug: ", bugid
            result += formatDefaultBugRow bugStr
            continue

        buglink = """<a class="#{if bug.status == "RESOLVED" or bug.status == "VERIFIED" then "bugid resolved" else "bugid"}" href="https://bugzilla.mozilla.org/show_bug.cgi?id=#{bugid}" target="_blank">#{bugid}</a>"""
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
        
        patchInfo = """<span class="patchstatus" title="#{flags.join(", ")}">#{bestStatus}</span>"""
        result += """
                            <tr>
                                <td>#{i+1}</td>
                                <td>#{buglink}</td>
                                <td>#{patchInfo}</td>
                                <td>#{bug.summary}</td>
                                <td>#{bug.assignedName}</td>
                                <td>#{if bug.whiteboard? then bug.whiteboard else ""}</td>
                            </tr>
"""
    result += """
                    </tbody>
                </table>
            </section>
    """


exports.showProject = (id) ->
    if id == "people"
        exports.showPeople()
        return
    else if id == "summary"
        # summary turned off for now due to breakage
        exports.showSummary()
        return
    else if id == "news"
        exports.showNews()
        return
    
    $('#content').show()
    $('#people').hide()
    project = projectMap[id]
    projectStr = """
    <section class="project" id="#{project.id}">
        <div class="summary">
            <div class="main">
                <div class="top">
            <h2><a href="#{project.url}">#{project.name}</a></h2>
                    <div class="counts">
                        <span class="bugs">#{project.bugs.length}</span>
                    </div>
                    <div class="avatars"></div>
                </div>
                <div class="bottom">
            <div class="blurb">#{project.blurb}</div>
                </div>
            </div>
            <div class="status">#{project.status}</div>
        </div>
    """
    if project.people
        projectStr += """
            <section class="people">
                <h3>People</h3>
                <ul>
"""
        for person in people
            projectStr += """
                        <li>#{person}</li>
"""
        projectStr += """
                </ul>
            </section>
"""
    projectStr += """
        <div class="tabs">
"""
    if project.updates? and project.updates.length > 0
        projectStr += """
                <section>
                    <h3>Updates</h3>
                    <ul>
"""
        for update in project.updates
            projectStr += """
                            <li>#{update}</li>
"""
        projectStr += """
                    </ul>
                </section>
"""
    if project.bugs? and project.bugs.length > 0
        projectStr += createBugTable project
    projectStr += """
    </section>
"""
    newNode = $(projectStr)
    $("table.bugs", newNode).dataTable({
        bPaginate: false
        bInfo: false
    })
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

exports.showPeople = () ->
    $('#content').hide()
    $('#people').show()
    location.hash = "#people"

exports.showNews = () ->
    $('#content').show()
    $('#people').hide()
    
    content = """<secton class="news">
<table class="news">
    <thead>
        <th>Date/Time</th>
        <th>Project</th>
        <th>Bug</th>
        <th>What Happened</th>
    </thead>
    <tbody>
"""
    for event in statusdata.timeline.events
        content += """<tr><td>#{event.when}</td><td>&nbsp;</td><td>#{event.bugId}</td><td>#{event.type} #{event.detail}</td></tr>"""
    content += """
</tbody>
</table>
</section>
"""

    container = $ "#content"
    container.children().remove()
    contentNode = $ content
    $("table.news", contentNode).dataTable({
        bPaginate: false
        bInfo: false
    })
    container.append(contentNode)
    location.hash = "#news"

    
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
<table class="releases">
    <thead>
        <tr>
            <th>Release</th>
            <th>Feature</th>
            <th>Status</th>
            <th>Open Bugs</th>
            <th>with Patches</th>
        </tr>
    </thead>
    <tbody>
"""
    formatProjectLine = (release, project) ->
        counts = project.getBugCounts()
        releaseName = if release then "Firefox #{release}" else "None"
        
        """
        <tr><td>#{releaseName}</td><td class="project" data-id="#{project.id}">#{project.name}</td><td>#{project.status}</td><td>#{counts.open}</td><td>#{counts.withPatches}</td>
        """

    for i in [firstRelease..lastRelease]
        release = releases[i]
        if not release?
            continue
        for project in release
            content += formatProjectLine i, project
    
    for project in projects
        if not project.target
            content += formatProjectLine null, project

    content += """
    </tbody>
</table>
"""
    
    content += """
</section>
"""
    container = $("#content")
    container.children().remove()
    contentNode = $ content
    $("table.releases", contentNode).dataTable({
        bPaginate: false
        bInfo: false
    })
    container.append(contentNode)

    $("td.project", container).click (e) ->
        exports.showProject($(e.target).attr("data-id"))

    location.hash = "#summary"

exports.populatePage = () ->
    for project in projects
        newNode = $("""<div data-id="#{project.id}">#{project.name}</div>""")
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
        hash = "news"
    
    exports.showProject hash
