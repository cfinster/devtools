exports = specjs.updater = {}

Projects = specjs.status.Projects
getBugIDandLabel = specjs.status.getBugIDandLabel

# Adapted from TiddlyWiki

# Returns null if it can't do it, false if there's an error, true if it saved OK
saveFile = (filePath,content) ->
    console.log "Saving to ", filePath
    if window.Components
        try
            console.log "Requesting enhanced privileges"
            netscape.security.PrivilegeManager.enablePrivilege "UniversalXPConnect"
            
            file = Components.classes["@mozilla.org/file/local;1"].createInstance Components.interfaces.nsILocalFile
            file.initWithPath filePath
            if !file.exists()
                file.create 0, 0664
            out = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance Components.interfaces.nsIFileOutputStream
            out.init file, 0x20|0x02, 00004, null
            out.write content, content.length
            out.flush()
            out.close()
            console.log "Saved"
            return true
        catch ex
            return false
    return null

exports.datadir = null
exports.bugList = null
exports.bugData = null

checkDataDir = () ->
    exports.datadir = $('#datadir').val()
    if !exports.datadir
        alert "Please set the datadir first"
        return false
    return true

exports.attachUI = () ->
    exports.datadir = $('#datadir').val()
    
    $('#update').click(() ->
        if !checkDataDir()
            return
        exports.gatherBugList exports.saveBugData
    )
    
    $('#statusupdate').click(() ->
        if !checkDataDir()
            return
        if !exports.bugData
            buggerall.getCachedResult "bugdata.json?" + new Date().getTime(), (q) ->
                exports.bugData = q
                exports.generateStatusData()
        else
            exports.generateStatusData()
    )
    console.log "UI ready"

exports.gatherBugList = (callback) ->
    bugIds = []
    for project in projects
        if !project.bugs
            return
        for bug in project.bugs
            bugIds.push getBugIDandLabel(bug).id
    
    exports.bugList = _.uniq bugIds
    console.log "Bug list from projects.js: ", exports.bugList
    callback exports.bugList

exports.saveBugData = () ->
    if !exports.bugList
        return
    q = new buggerall.Query
        bugid: exports.bugList.join(","),
        whitespace: true
    
    console.log "Gathering from bugzilla: ", q.query
    q.run (q) ->
        exports.bugData = q.result
        output = q.serialize()
        saveFile exports.datadir + "/bugdata.json", output

exports.generateStatusData = () ->
    statusdata = 
        bugs: {}
        reviewQueues: {}

    bugs = statusdata.bugs
    reviewQueues = statusdata.reviewQueues
    bugData = exports.bugData
    for key of bugData
        bugSummary = bugs[key] = {}
        bug = bugData[key]
        bugSummary.summary = bug.summary
        bugSummary.status = bug.status
        bugSummary.assignedName = if bug.assigned_to then bug.assigned_to.name else null
        bugSummary.whiteboard = bug.whiteboard
        bugSummary.hasPatch = false
        
        if bug.attachments?
            for attachmentId, attachment of bug.attachments
                if not attachment.is_patch or attachment.is_obsolete or not attachment.flags?
                    continue
                for flag in attachment.flags
                    if flag.status != "?" or not flag.requestee?
                        continue
                    requesteeName = flag.requestee.name
                    requesteeQueue = reviewQueues[requesteeName]
                    if not requesteeQueue?
                        requesteeQueue = reviewQueues[requesteeName] = {}
                    queueType = requesteeQueue[flag.name]
                    if not queueType?
                        queueType = requesteeQueue[flag.name] = {}
                        queueType.devtoolsSize = 0
                        queueType.devtoolsCount = 0
                    queueType.devtoolsCount++
                    queueType.devtoolsSize += attachment.size

        patch = bug.getLatestPatch()
        flags = bugSummary.flags = {}
        flags.feedback = []
        flags.review = []
        flags.superreview = []
        if patch
            bugSummary.hasPatch = true
            bugSummary.patchSize = patch.size
            if patch.flags
                for flag in patch.flags
                    if flag.name == "review" or flag.name == "feedback" or flag.name == "superreview"
                        flags[flag.name].push 
                            status: flag.status,
                            requestee: flag.requestee && flag.requestee.name,
                            setter: flag.setter && flag.setter.name
    saveFile exports.datadir + "/status.json", JSON.stringify statusdata, null, 1

