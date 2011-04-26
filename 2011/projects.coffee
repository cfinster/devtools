# This is the project data for the status.html page

@estimates = 
    "577721": [6, 12, 16]
    "585991": [1, 2, 4]
    "637801": [1, 1, 2]
    "638949": [4, 8, 16]
    "614586": [8, 16, 24]
    "646025": [8, 16, 48]
    "646028": [4, 6, 8]
    "585956": [8, 16, 24]
    "637131": [4, 8, 16]
    "592552": [1, 3, 4]
    "642112": [2, 4, 8]
    "622303": [4, 6, 12]

@projects = [
    {
        id: "console5"
        url: "https://wiki.mozilla.org/DevTools/Features/WebConsole5"
        name: "Web Console '5'"
        blurb: "Adding awesome to the existing Web Console"
        status: "Aurora"
        people: ["ddahl", "msucan"]
        bugs: [
            "642108 JS errors from HUD in Error Console"
            "616742 Implement console.debug"
            "637801 console.log shouldn't display escaped strings"
        ]
    }
    {
        id: "workspaces"
        url: "https://wiki.mozilla.org/DevTools/Features/Workspaces"
        name: "Workspaces First Take"
        blurb: "The humane way to monkey with code"
        status: "Implementation"
        people: ["msucan", "rcampbell"]
        bugs: [
            "642176 Integrate Workspace extension into the browser"
            "636725 Unit tests for Workspaces"
            "646070 Respect chrome developer tools preference in workspace"
            "646524 Cache the sandboxes"
            "650760 Help menu"
            "651872 access key for menu option"
        ]
        updates: [
            "2011/04/14 Security review complete"
            "2011/03/18 Patch to put the Workspaces in browser"
            "2011/03/01 Prototype is working as a Jetpack"
            "2011/01/05 Initial Prototype Add-On"
        ]
    }
    {
        id: "highlighter"
        url: "https://wiki.mozilla.org/DevTools/Features/Highlighter"
        name: "Highlighter"
        blurb: "Beautiful information about your DOM"
        status: "Implementation"
        people: ["rcampbell"]
        bugs: [
            642471
            "650802 Create some controller UI"
            "650825 create a content broker"
            "650794 Strip HTML panel and support code from browser"
        ]
    }
    {
        id: "styleinspector"
        url: "https://wiki.mozilla.org/DevTools/Features/StyleInspector"
        name: "Style Inspector"
        blurb: "View an element's style, in style!"
        status: "Implementation"
        people: ["mratcliffe"]
        bugs: [
            "582596 style view answering common CSS questions"
            "591212 react to dynamic changes to the stylesheets"
            "586977 investigate how the panel works with shorthand properties"
            "588941 computed style for property is sometimes wrong"
            "586974 all unmatched rules are ranked the same"
            "587752 animations in the panel"
            "589375 keyboard access"
            "592743 specificity calculator makes mistakes"
            "585563 Allow CSS editing from inspector"
            "651443 Style Panel properties limited to hard coded values"
            "652509 Style inspector should skip unsupported styles"
        ]
    }
    {
        id: "webconsole6"
        url: "https://wiki.mozilla.org/DevTools/Features/WebConsoleUpgrade"
        name: "Web Console Upgrade"
        blurb: "Console positioning, service, autocompletion and more"
        status: "Implementation"
        people: []
        bugs: [
            577721
            585991
            637801
            632347
            632275
            644596
            618311
            638949
            609890
            611032
            612658
            595223
            626484
            619598
            612252
            614586
            642615
            646025
            646028
            643184
            "637131 Unexpected load of chrome://browser/content/browser.xul when using the Web Console (Ctrl-Maj-K)"
            "585956 Implement console.trace() in web console"
            "644419 Console should have user-settable log limits for each message category"
            "642109 Web Console REPL 'readline' occasionally stops working right"
            "642111 Web Console messages should scroll into view automatically"
            "646504 Global console should have decent display of stack traces"
            "587757 Implement Browser Console"
            "592552 History is shared among all Web Console instances"
            "622303 Web Console should remember filter settings"
            "649350 Cleanup/reorganize the HUDService observers and listeners"
            "650780 evaluating a null object returns TypeError: aObject is null"
            "630460 command-w doesn't close inspector panels"
            "651501 document.body properties fail to autocomplete"
            "616586 Internal console logging API"
            "588871 Remove ConsoleStorage methods used for log message storage"
        ]
    }
    {
        id: "gcli"
        url: "https://wiki.mozilla.org/DevTools/Features/GCLI"
        name: "Graphical Command Line Interface"
        blurb: "The fastest, most discoverable way to control your tools"
        status: "Implementation"
        people: ["jwalker"]
        bugs: [
            641903
            642505
            "642231 Prepare GCLI for review"
            "642241 Experiment with better UI presentation methods in GCLI"
            "642401 Ace/Pilot/GCLI doesn't have a good definition of pref scopes"
            "642400 Ace/Pilot/GCLI doesn't have a good definition of the environment"
            "642242 GCLI should embed help as commands"
            "642240 GCLI needs some form of URI for reference to everything"
            "642239 GCLI should have history retention"
            "642238 GCLI metadata should have types on return values"
            "642237 GCLI should display its opening command menu in a hierarchy"
            "642226 GCLI should support use without an input element"
            "642196 GCLI should allow JS to be entered using {}"
            "642189 GCLI should support grouped parameters"
            "651081 Ensure GCLI commands are executed securely"
            "651071 Enhance the Web Console with a command-based input system"
        ]
    }
    {
        id: "viewsource"
        name: "View Source Reboot"
        blurb: "The View Source of the Future"
        status: "Planning"
        people: ["msucan", "getify"]
        bugs: [
            "650893 New View Source component"
            "650895 Initial implementation of the new View Source tool"
            "246620 Add line numbers to view source"
        ]
        notes: [
            "deminification"
            "insert alert"
            "view and edit?"
            "current source vs. original/cached"
        ]
    }
    {
        id: "cssedit"
        name: "CSS Editor"
        blurb: "Tweak and view!"
        status: "Implementation"
        people: ["cedricv"]
        bugs: [
            "583041 CSS editor"
            "590307 inline stylesheet support"
            "590795 edits should be reflected in the Inspector"
            "590796 style inspector link to the CSS editor"
            "590797 resizable editor panel"
            "590799 CSS editor styling"
            "594742 unsaved state reappears when the editor is reopened"
        ]
    }
    {
        id: "cssdoctor"
        url: "https://wiki.mozilla.org/DevTools/Features/CSSDoctor"
        name: "CSS Doctor"
        blurb: "The cure for what ails your CSS"
        status: "Planning"
        people: ["jwalker"]
        bugs: []
    }
    {
        id: "debugger"
        url: "https://wiki.mozilla.org/DevTools/Features/Debugger"
        name: "Debugger"
        blurb: "A straightforward walk through your code"
        status: "Planning"
        people: ["dcamp"]
    }
    {
        id: "sdk"
        url: "https://wiki.mozilla.org/DevTools/Features/SDK"
        name: "DevTools SDK 1"
        blurb: "First bits of customizability"
        status: "Planning"
        bugs: [
            639518
            638871
            638131
            638142
            637291
        ]
    }
    {
        id: "memoryback"
        url: "https://wiki.mozilla.org/DevTools/Features/Memory"
        name: "Memory Tooling Backend"
        blurb: "Data for the future"
        status: "Planning"
        people: ["dcamp"]
        bugs: [
            646734
            646735
            646737
            646739
        ]
    }
    {
        id: "gauges"
        name: "Gauges"
        blurb: "Page performance at-a-glance"
        status: "Planning"
        people: []
        bugs: []
    }
    {
        id: "firebug6"
        name: "Firebug Platform Improvements"
        status: "Planning"
        people: []
        bugs: [
            580880
            524674
            638075
            634073
            529536
            526207
            641236
            641234
            "642136 Debugger access to closure environments"
            "642801 Firefox 4.0 Crash Report [@ SelectorMatches ]"
            "645160 [regression] Incorrect jsdIStackFrame for eval() calls (breaks Dojo)"
        ]
    }
    {
        id: "jsd2"
        url: "https://wiki.mozilla.org/DevTools/Features/JSD2"
        name: "JSD2"
        blurb: "Debugging the multiprocess world"
        status: "Planning"
        people: ["jblandy"]
        bugs: [
            "560314"
            "636907"
        ]
    }
    {
        id: "ui"
        url: "https://wiki.mozilla.org/DevTools/Features/OverallUI"
        name: "Overall UI"
        blurb: "The way things fit together"
        status: "Planning"
        people: []
        bugs: [
            554926
        ]
        updates: [
            "2011/02/24 Quick mockups added"
        ]
    }
    {
        id: "workspaces6"
        url: "https://wiki.mozilla.org/DevTools/Features/WorkspacesRefined"
        name: "Workspaces Refined"
        blurb: "The refined, humane way to engage in software development experiments."
        status: "Planning"
        people: []
        bugs: [
            "646524 cache the sandboxes"
            "636727 Add Ace to workspaces"
            "636731 Add GCLI commands for Workspaces"
            "644413 Workspaces should be able to restore their context via mode-line"
            "644409 Make workspaces save their state across restarts"
            "651941 Persist workspaces across session restarts"
            "651942 Add recent files to the file menu"
        ]
    }
    {
        id: "incontent"
        name: "In-Content Tools"
        blurb: "Improved support for browser content-based tools"
        status: "Planning"
        people: []
        bugs: [
            638452
        ]
    }
    {
        id: "objectinspector"
        name: "Object Inspector Plus"
        blurb: "Take a look inside!"
        status: "Planning"
        bugs: []
    }
]

@people = [
    {
        id: "msucan"
        name: "Mihai Sucan"
        avatar: "http://a2.twimg.com/profile_images/326719609/avatar_robodesign_v5_reasonably_small.png"
        bugzillaId: "mihai.sucan@gmail.com"
    }
    {
        id: "rcampbell"
        name: "Rob Campbell"
        avatar: "http://gravatar.com/avatar/34f8f3442a6be7ae2cb26459a2e33fc1"
        bugzillaId: "rcampbell@mozilla.com"
    }
    {
        id: "jwalker"
        name: "Joe Walker"
        avatar: "http://gravatar.com/avatar/8dd47f0c426cd8204b8bf996cb98cb56"
        bugzillaId: "jwalker@mozilla.com"
    }
    {
        id: "ddahl"
        name: "David Dahl"
        avatar: "http://a0.twimg.com/profile_images/1090231487/Selection_001_reasonably_small.png"
        bugzillaId: "ddahl@mozilla.com"
    }
    {
        id: "dcamp"
        name: "Dave Camp"
        avatar: "http://a1.twimg.com/profile_images/28279492/campd_bigger.png"
        bugzillaId: "dcamp@mozilla.com"
    }
    {
        id: "kdangoor"
        name: "Kevin Dangoor"
        avatar: "http://gravatar.com/avatar/f4749cce627b584fb9e59966a5d2c924"
        bugzillaId: "kdangoor@mozilla.com"
        reviewCheck: false
    }
    {
        id: "jodvarko"
        name: "Jan Odvarko"
        avatar: "http://gravatar.com/avatar/34b251cf082c202fb3160b1afb810001"
        reviewCheck: false
    }
    {
        id: "jblandy"
        name: "Jim Blandy"
        avatar: "http://www.red-bean.com/jimb/jimb.jpg"
        bugzillaId: "jimb@mozilla.com"
    }
    {
        id: "cedricv"
        name: "Cedric Vivier"
        avatar: "http://gravatar.com/avatar/c5216fcabd0916a2447742cd7d0a375d"
        bugzillaId: "cedricv@neonux.com"
    }
    {
        id: "mratcliffe"
        name: "Mike Ratcliffe"
        avatar: "http://gravatar.com/avatar/7de9609bb8d1394e8f6236bd0fac2d7b"
        bugzillaId: "mratcliffe@mozilla.com"
    }
    {
        id: "getify"
        name: "Kyle Simpson"
        avatar: "http://gravatar.com/avatar/35761e3936deba2f8189c2d20982c771"
        bugzillaId: "getify@mozilla.com"
    }
    {
        id: "gavin.sharp"
        name: "Gavin Sharp"
        avatar: "http://gravatar.com/avatar/08de945228403cb0598d5906e2407a7d"
        bugzillaId: "gavin.sharp@gmail.com"
    }
    {
        id: "bugzilla"
        name: "Gervase Markham"
        avatar: "http://gravatar.com/avatar/559c3cf31c98a95b23421186b78df500"
        bugzillaId: "bugzilla@gerv.net"
    }
    {
        id: "benjamin"
        name: "Benjamin Smedberg"
        avatar: "http://gravatar.com/avatar/3301a62f3707d6bcef9542d316fb587f"
        bugzillaId: "benjamin@smedbergs.us"
    }
]