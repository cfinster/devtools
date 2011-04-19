# manages the status page

@specjs = @specjs ? {}

@specjs.status = {}

exports = @specjs.status

getBugID = (text) ->
    getBugIDandLabel(text).id

exports.getBugIDandLabel = getBugIDandLabel = (text) ->
    text = text.toString()
    match = /^(bug|)\s*(\d+)\s*(.*)/.exec text
    
    return null if !match

    return {
        id: match[2]
        label: match[3]
    }

class Project
    constructor: (@data) ->
        _.extend(this, {
            id: ""
            url: ""
            name: ""
            blurb: ""
            stauts: ""
            people: []
            bugs: []
            updates: []
            flags: []
        }, data)

    getBugIds: () ->
        getBugId bug for bug in @bugs

exports.Project = Project

class Person
    constructor: (data) ->
        _.extend(this, {
            id: ""
            name: ""
            avatar: ""
        }, data)

exports.Person = Person

exports.projects = {}

augmentProjects = () ->
    latestUpdates = [];
    for project in exports.projects
        elem = $('<a/>', {
            html: "&#9654; "
            click: expander
            href: "#" + project.id
            "class": "expander"
        })
        project.expanded = false
        elem[0].project = project
        $(project.el).find("h2").prepend(elem)
        
        projel = $(project.el)
        
        summary = $('<div/>', {
            "class": "summary"
        })
        main = $('<div/>', {
            "class": "main"
        })
        summary.append(main)
        projel.children("div.status").detach().appendTo(summary)
        
        top = $('<div/>', {
            "class": "top"
        })
        bottom = $('<div/>', {
            "class": "bottom"
        })
        main.append top
        main.append bottom
        projel.children("h2").detach().appendTo(top)
        
        counts = $('<div/>', {
            "class": "counts"
        })
        
        flagcount = project.getFlagCount()
        if flagcount
            $('<span/>', {
                "class": "flags"
                text: flagcount
            }).appendTo(counts)
        
        bugcount = project.getBugCount()
        $('<span/>', {
            "class": "bugs"
            text: bugcount
        }).appendTo(counts)
        
        top.append(counts)
        
        avatars = $('<div/>', {
            "class": "avatars"
        })
        top.append(avatars)
        
        for person in project.getPeople
            $(person.getAvatar()).clone().appendTo(avatars)
        
        projel.children("div.blurb").detach().appendTo(bottom)
        projel.prepend(summary)

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
        bug = data[bugid]
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

projectMap = {};

for i in [0..projects.length]
    project = new Project projects[i]
    projects[i] = project
    projectMap[project.id] = project

exports.showProject = (id) ->
    project = projectMap[id]
    newNode = $(exports.projectTemplate(project))
    $("#content").children().remove().append(newNode)
    newNode.appendTo($("#content"))
    $(".status").each(() ->
        el = $(this)
        status = el.text().replace(/^\s+|\s+$/,"")
        statusAbbreviation = status.substring(0, 2).toUpperCase()
        el.html('<div>' + statusAbbreviation + '</div><div>' + status + '</div>')
    ).bigtext()
    location.hash = id
    updateBugInformation()

exports.populatePage = () ->
    exports.projectTemplate = _.template(document.getElementById("project_template").innerHTML)
    exports.personTemplate = _.template(document.getElementById("person_template").innerHTML)
    projectNavTemplate = _.template(document.getElementById("project_nav_template").innerHTML)
    for project in projects
        newNode = $(projectNavTemplate(project))
        newNode.appendTo($("#nav"))
    
    $('.maindate').each () ->
        el = $(this)
        text = el.text()
        el.html("<div>" + text.split(" ").join("</div><div>") + "</div>").bigtext()
    
    $("#nav").click (e) ->
        exports.showProject($(e.target).attr("data-id"))
    
    
exports.jumpToProject = () ->
    hash = location.hash.substring(1)
    return if !hash
    
    exports.showProject hash
