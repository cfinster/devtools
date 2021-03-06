exports = specjs.updater = {}

Projects = specjs.status.Projects
getBugIDandLabel = specjs.status.getBugIDandLabel

# Adapted from TiddlyWiki

# Returns null if it can't do it, false if there's an error, true if it saved OK
saveFile = (filePath,content) ->
    if window.Components
        try
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
            return true
        catch ex
            return false
    return null

exports.datadir = null
exports.bugList = null
exports.bugData = null
exports.newBugs = null

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
            computeLastCommentTime: true
        
        # Query to find all new Developer Tools bugs for the last 30 days
        # excluding the ones we already know about in the project file.
        @newBugQuery = new buggerall.Query
            query: """bug_id=#{exports.bugList.join(",")}&bug_id_type=nowords&resolution=---&query_format=advanced&chfield=[Bug creation]&chfieldfrom=30d&chfieldto=Now&component=Developer Tools&product=Firefox"""
            fields: "id,summary,creation_time"
            whitespace: true
        
        @queryCount = 0
        @reviewBugs = []
    
    queryDone: () ->
        @queryCount--
        console.log "Done with query, remaining: ", @queryCount
        if @queryCount == 0
            @gatherReviewBugData()
    
    run: () ->
        @queryCount += 2
        console.log "Gathering data from bugzilla"
        @mainQuery.run (q) =>
            console.log "finished with main query"
            @queryDone()
        @newBugQuery.run (q) =>
            console.log "finished with new bug query"
            @queryDone()
        
        # temporarily short circuit review queue loading
        return

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
            q.run @reviewQueueResult
            
    reviewQueueResult: (q) =>
        console.log "Finished with review queue query", @queryCount
        for id of q.result
            @reviewBugs.push id
        @queryDone()
    
    gatherReviewBugData: () ->
        if @reviewBugs.length == 0
            @saveData()
            return

        buglist = _.uniq(@reviewBugs, false)

        @reviewQuery = new buggerall.Query
            bugid: buglist.join(","),
            whitespace: true
            includeHistory: true
            historyCacheURL: "bughistory/"
        
        @reviewQuery.run @saveData

    
    saveData: () =>
        console.log "Saving query results"

        q = @mainQuery

        for bugId, bug of q.result
            bug.devtoolsBug = true

        if @reviewQuery?
            q.merge @reviewQuery

        if not q.result
            console.log "No bugzilla results - not saving"
            return
        
        console.log "Saving bugdata.json"
        exports.bugData = q.result
        output = q.serialize()
        saveFile exports.datadir + "/bugdata.json", output
        for bugId, bug of exports.bugData
            saveFile  "#{exports.datadir}/bughistory/#{bug.id}.json", bug.history.serialize()
        
        console.log "Saving newbugs.json"
        exports.newBugs = @newBugQuery.result
        output = @newBugQuery.serialize()
        saveFile exports.datadir + "/newbugs.json", output
        

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
        bug = bugData[key]
        if not bug?
            throw new Error("Where's the bug data for #{key}?")

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
                        queueType.totalSize = 0
                        queueType.totalCount = 0
                    if bug.devtoolsBug
                        queueType.devtoolsCount++
                        queueType.devtoolsSize += attachment.size
                    queueType.totalCount++
                    queueType.totalSize += attachment.size
        
        # the way we look up bugs will generate review queue
        # info that we don't care about
        toDelete = []
        for id, data of reviewQueues
            if not data.review?.devtoolsCount
                toDelete.push id
        delete reviewQueues[item] for item in toDelete

        # we only want devtools bugs in the final status file
        # not the other random bugs looked up as part of
        # review queue processing
        if not bug.devtoolsBug
            continue

        bugSummary = bugs[key] = {}
        bugSummary.summary = bug.summary
        bugSummary.status = bug.status
        bugSummary.assignedName = if bug.assigned_to then bug.assigned_to.name else null
        bugSummary.whiteboard = bug.whiteboard
        bugSummary.hasPatch = false
        
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

MILLISECONDS_IN_MONTH = 30*24*60*60*1000

loadCachedBugData = () ->
    console.log "Reloading cached bugdata"
    buggerall.getCachedResult "newbugs.json", (data) ->
        console.log "New bugs retrieved"
        exports.newBugs = data

        buggerall.getCachedResult "bugdata.json", (data) ->
            console.log "Bugdata retrieved"
            exports.bugData = data

            cutoff = new Date().getTime() - MILLISECONDS_IN_MONTH
            queryCount = 0

            historyComplete = (bug) ->
                queryCount--
                changesets = bug.history.changesets
                
                if queryCount < 1
                    exports.generateStatusData()

            for key, bug of data
                if bug.last_change_time.getTime() > cutoff
                    queryCount++
                    bug.loadHistory "bughistory/#{key}.json", historyComplete



exports.generateStatusData = () ->
    statusdata = 
        update: new Date().toString("MMMM dd")
        bugs: {}
        reviewQueues: {}
    
    if not exports.bugData
        loadCachedBugData()
        return

    addBugData statusdata
    statusdata.timeline = new buggerall.Timeline(exports.bugData, 30)
    for id, bug of exports.newBugs
        statusdata.timeline.events.push(new buggerall.TimelineEntry(id, bug.creation_time, "newBug", bug.summary))
        statusdata.timeline.sortEvents()
    
    for entry in statusdata.timeline.events
        entry.when = entry.when.toString("MM/dd HH:mm")

    saveFile exports.datadir + "/status.json", JSON.stringify statusdata, null, 1

