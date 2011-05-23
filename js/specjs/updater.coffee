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
    callback exports.bugList

class BugDataCollector
    constructor: () ->
        @mainQuery = new buggerall.Query
            bugid: exports.bugList.join(","),
            whitespace: true
            includeHistory: true
            historyCacheURL: "bughistory/"

        @queryCount = 0
        @reviewBugs = []
    
    queryDone: () ->
        @queryCount--
        if @queryCount == 0
            @saveData()
    
    run: () ->
        @queryCount++
        console.log "Gathering data from bugzilla"
        @mainQuery.run (q) =>
            console.log "finished with main query"
            @queryDone()
        
        for person in people
            if person.reviewCheck == false
                continue
            
            # do a search for people who have review requests
            # for patches that are not obsolete
            # TODO: expand to also include feedback requests
            q = new buggerall.Query
                query: "field0-3-0=requestees.login_name&type0-1-0=notequals&field0-1-0=attachments.isobsolete&field0-0-0=attachments.ispatch&resolution=---&value0-3-0=#{person.bugzillaId}&query_format=advanced&value0-2-0=review&value0-1-0=1&type0-3-0=equals&field0-2-0=flagtypes.name&type0-0-0=equals&value0-0-0=1&type0-2-0=substring"
                fields: "id"
            
            console.log "Query: ", q.query
            @queryCount++
            q.run this.reviewQueueResult
            
    reviewQueueResult: (q) =>
        console.log "Finished with review queue query", @queryCount
        for id in q.result
            console.log "id: ", id
        @queryDone()
    
    saveData: () ->
        console.log "Saving query results"

        q = @mainQuery
        if not q.result
            console.log "No bugzilla results - not saving"
            return

        exports.bugData = q.result
        output = q.serialize()
        saveFile exports.datadir + "/bugdata.json", output
        for bugId, bug of exports.bugData
            console.log "bug", bug.id, " history", bug.history
            saveFile  "#{exports.datadir}/bughistory/#{bug.id}.json", bug.history.serialize()
        

exports.saveBugData = () ->
    if !exports.bugList
        return
    
    console.log "setting up bugzilla collector"
    bdc = new BugDataCollector()
    bdc.run()
    

addBugData = (statusdata) ->
    bugs = statusdata.bugs
    reviewQueues = statusdata.reviewQueues
    bugData = exports.bugData
    for key of bugData
        bugSummary = bugs[key] = {}
        bug = bugData[key]
        if not bug?
            throw new Error("Where's the bug data for #{key}?")
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

loadCachedBugData = () ->
    console.log "Reloading cached bugdata"
    buggerall.getCachedResult("bugdata.json", (data) ->
        console.log "Bugdata retrieved"
        exports.bugData = data
        exports.generateStatusData()
    )


exports.generateStatusData = () ->
    statusdata = 
        bugs: {}
        reviewQueues: {}
    
    if not exports.bugData
        loadCachedBugData()
        return

    addBugData statusdata
    saveFile exports.datadir + "/status.json", JSON.stringify statusdata, null, 1

