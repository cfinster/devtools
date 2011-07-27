# This is the project data for the status.html page

@projects = [
    {
        id: "workspaces"
        url: "https://wiki.mozilla.org/DevTools/Features/Workspaces"
        name: "Scratchpad First Take"
        blurb: "The humane way to monkey with code"
        status: "Beta"
        target: 6
        people: ["msucan", "rcampbell"]
        bugs: [
            "642176 Integrate Workspace extension into the browser"
            "636725 Unit tests for Workspaces"
            "646070 Respect chrome developer tools preference in rkspace# "
            "646524 Cache the sandboxes"
            "651872 access key for menu option"
            "656021 Update Scratchpad menu access key to S"
            "653108 workspace is tied to the tab it was first run in"
            "658344 useful introductory text"
            "646524 cache the sandboxes"
            "657136 Rename top-level Context menu to something less # nfusing"
            "657131 Create an Execute menu"
            "660560 pressing Tab should indent"
            "663746 Change Scratchpad shortcut key to something other than F4"
        ]
        updates: [
            "2011/04/14 Security review complete"
            "2011/03/18 Patch to put the Workspaces in browser"
            "2011/03/01 Prototype is working as a Jetpack"
            "2011/01/05 Initial Prototype Add-On"
        ]
    }
    {
        id: "webdevmenu"
        url: "https://wiki.mozilla.org/DevTools/Features/WebDeveloperMenu"
        name: "Web Developer Menu"
        blurb: "New home for web developer tools"
        status: "Beta"
        target: 6
        people: ["rcampbell", "msucan"]
        bugs: [
            "653221 Web Developer Menu"
            "655776 Get More Tools menu item"
            "656360 access key problem"
        ]
    }
    {
        id: "webconsole6"
        url: "https://wiki.mozilla.org/DevTools/Features/WebConsoleUpgrade"
        name: "Web Console 6"
        blurb: "Console positioning, autocompletion and more"
        status: "Beta"
        target: 6
        people: ["past", "msucan", "ddahl"]
        bugs: [
            577721
            "585991 Show a popup listing possible completions"
            637801
            632347
            632275
            595223
            626484
            619598
            642615
            646025
            "585956 Implement console.trace() in web console"
            "644419 Console should have user-settable log limits for each message category"
            "642109 Web Console REPL 'readline' occasionally stops working right"
            "642111 Web Console messages should scroll into view automatically"
            "650780 evaluating a null object returns TypeError: aObject is null"
            "659910 console.log from Scratchpad sends people to Scratchpad.com"
            "659778 Autocomplete is behind the console window"
            "633204 Autocomplete isn't fully cleared on ctrl+backspace"
            "663443 No indication to which tab a Web Console belongs"
            "660806 autocomplete shows during history navigation"
        ],
        updates: [
            "2011/05/23 Security review complete"
        ]
    }
    {
        id: "webconsole7"
        url: "https://wiki.mozilla.org/DevTools/Features/WebConsole7"
        name: "Web Console 7"
        blurb: "document.body autocompletion and select all fixes"
        status: "Aurora"
        target: 7
        people: []
        bugs: [
            "651501 document.body properties fail to autocomplete"
            "634406 Select All unexpectedly results in multi-line input"
            "653110 undefined appended after pasted text"
        ]
    }
    {
        id: "highlighter"
        url: "https://wiki.mozilla.org/DevTools/Features/Highlighter"
        name: "Highlighter"
        blurb: "Beautiful information about your DOM"
        status: "Implementation"
        target: 8
        people: ["rcampbell", "paul"]
        bugs: [
            "642471 Rewrite PanelHighlighter using transparent xul iframe"
            "650802 Create some controller UI"
            "650825 create a content broker"
            "650794 Strip HTML panel and support code from browser"
            "653528 Strip out Style and DOM panels and support code from Inspector"
            "642471 Rewrite PanelHighlighter using transparent xul iframe and canvas"
            "653531 Shared knowledge of selected node"
            "653534 Create basic Annotations feature"
            "653545 Create a means to highlight multiple items on a single webpage"
            "653549 Add a close button to the selected node"
            "653550 Add a close button"
            "587134 Context menu item for Highlight Element"
            "566084 disabled when navigating to new pages"
            "566085 tracking DOM changes"
            "660606 allow registration of developer tools"
            "663100 Re-implement highlighting mechanism in HTML+flexbox"
            "663781 Once a node is locked, the black background should be removed"
            "663778 Draw layout information of the selected node"
            "663834 registerTools() should allow tools to be docked in the browser"
            "663778 Draw layout information"
            "672902 usable via keyboard"
            "672876 Inspect panel opens up on the wrong monitor"
            "672006 Selecting a node should update toolbar with a breadcrumb"
            "672003 Togglable classes in the infobar"
            "672002 dock the HTML panel"
            "671689 Nodes should be selectable from the HTML tree"
            "671294 Opening the Inspect window with the Web Console open causes the panel to open in the wrong position"
            "671291 iframe and html overlap in the inspect window"
            "674851 can't close inspect"
            "669652 Move the highlighter the code from inspector.js to a jsm"
            "668435 hilight box should round corners to match"
            "668254 doesn't handle full page zoom correctly"
            "665539 find the best duration and delay for transitions"
            "663852 support transformed elements (CSS3 transform)"
        ]
    }
    {
        id: "styleinspector"
        url: "https://wiki.mozilla.org/DevTools/Features/StyleInspector"
        name: "Style Inspector"
        blurb: "View an element's style, in style!"
        status: "Implementation"
        target: 8
        people: ["mratcliffe"]
        bugs: [
            "582596 Style view answering common CSS questions"
            "663831 Should be controllable from the Highlighter"
            "586974 All unmatched rules are ranked the same"
            "669596 Style Inspector should allow editing of css property values"
            "593331 Csslogic shortSource can create duplicate names"
            "583037 Better logic for placement of inspector panels"
            "590536 Inspector panels should remember at least size and ideally also position"
            "587752 Animations in the new Style panel"
            "585563 The inspector style panel should link to the CSS editor"
            "590796 Clicking on a rule doesn't jump to the correct line in the CSS editor"
            "589264 Add option to choose an alternative media type"
            "589375 Keyboard access"
            "591212 React to dynamic changes to the stylesheets"
            "591584 Localize the URLs in csshtmltree"
            "591902 Automatic display of localized content"
            "593345 Investigate an advanced test tool for the inspector style panel"
            "656220 Create styleInspector obj. containing cssLogic & cssHtmlTree, open/close methods"
            "656027 It should be possible to pref out the Style Inspector"
            "574347 Opening the HUD with Inspector open causes Style Panel to move"
            "586977 Investigate how the panel works with shorthand properties"
            "588941 Computed style for property is sometimes wrong"
            "591582 Style Panel CSS properties are limited to hard coded values"
            "652509 Style inspector should skip unsupported styles"
            "653082 Stylesheet selector should be removed"
            "653084 Specificity should be removed"
            "654068 Show visual indicator when there are unmatched rules but not matched rules"
            "654069 \"Effects and Other\" group should be extracted into more than 1 group"
            "654430 Unmatched rules do not work for string values"
            "672806 Style Inspector should be docked on the right of the content area"
            "672748 UI refresh"
            "672746 'include default styles' checkbox"
            "672744 Add search filter"
            "672743 remove category view"
            "674485 missing color legend for its rule colors"
            "674482 Make header fixed to ease knowing which element is being inspected"
            "669486 Uses same template engine as GCLI but different copy"
        ]
    }
    {
        id: "devtoolbar"
        name: "Developer Toolbar"
        blurb: "Quick access to the tools"
        status: "Planning"
        people: "paul"
        bugs: [
            "674476 Sidebar to host the developer tools"
        ]
    }
    {
        id: "gcli"
        url: "https://wiki.mozilla.org/DevTools/Features/GCLI"
        name: "Graphical Command Line Interface"
        blurb: "The fastest, most discoverable way to control your tools"
        status: "Implementation"
        target: 8
        people: ["jwalker", "fitzgen"]
        bugs: [
            "654962 GCLI demo"
            "653142 Create pilot.jsm required for Command Line"
            "653140 Pilot/Command Line need a CommonJS require"
            "656296 console.jsm from pilot should send reports to web "
            641903
            642505
            "653978 Command Line should be prefed out"
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
            "654986 lists only some of the available commands - it should list them all"
            "654985 help should sort commands alphabetically (according to locale)"
            "654970 UI tweaks"
            "653979 UI to switch web console between JS and Command Line modes"
            "653568 GCLI re-creates nodes in RequestView/ArgFetcher too often"
            "653567 GCLI should be checked for accessibility"
            "656668 Export from GCLI to JSM"
            "656666 Update HudService.jsm to allow GCLI integration"
            "657678 remove dependency on Pilot"
            "657677 Require.jsm unit tests"
            "658756 Experiment with popup UI for GCLI"
            "659889 GCLI should autostart"
            "661172 popup menu should be accessible"
            "660765 Simplify Requisition._onAssignmentChange"
            "660220 commands are double executed in Firefox"
            "663120 Simple (help-free) GCLI UI needs polish"
            "663124 Simple help-free version of GCLI has 1 string needing localization"
            "672824 single input area when embedded in Firefox"
            "672823 provide completion hints for JavaScript"
            "671848 up/down should be reserved for history, shift+up/down for increment/decrement"
            "671846 completion shows incorrectly for sub-commands"
            "671844 fails to position the cursor correctly on increment/decrement"
            "671837 should not allow boolean parameters to be positional"
            "671406 create a list of commands that could be useful in Firefox"
            "671311 needs a way to display single line output with no output area"
            "671255 pressing space at the start of a command shows misaligned completion"
            "668811 complete element misaligned on Windows"
            "666650 global toolbar"
            "665907 bounding boxes update are slow while the page is scrolling"
            "663833 add a floating toolbar next to the selected node"
            "663778 draw layout information"
            "665014 selecting text in the output area is broken"
            "664696 commands should be reviewed for security issues"
            "664693 all commands should be documented for security review"
            "664676 conversion error messages should be localized"
            "664377 needs test to check for mutating params with non-defaults after params with defaults"
            "664207 needs tests for escaped characters being converted in various ways"
            "664204 ArrayType.stringify doesn't handle strings with spaces properly"
            "664203 needs tests to check that a command without mandatory param causes ERROR"
            "664198 ArgFetcher.getInputFor registers a Field.fieldChanged listener but doesn't release it"
        ]
    }
    {
        id: "codeeditor"
        name: "Code Editor"
        blurb: "better editing for your codes"
        url: "https://wiki.mozilla.org/DevTools/Features/CodeEditor"
        target: 8
        status: "Implementation"
        people: ["msucan"]
        bugs: [
            "660784 Add a source code editor to the browser"
            "668320 Integrate Orion unit and performance tests"
        ]
    }
    {
        id: "cssedit"
        name: "Style Editor"
        blurb: "Tweak and view!"
        status: "Implementation"
        target: 8
        people: ["cedricv"]
        bugs: [
            "583041 CSS editor"
            "590307 inline stylesheet support"
            "590795 edits should be reflected in the Inspector"
            "590796 style inspector link to the CSS editor"
            "590797 resizable editor panel"
            "590799 CSS editor styling"
            "594742 unsaved state reappears when the editor is reopened"
            "674177 use Orion"
            "673129 import a file as a new style sheet"
            "673127 save to file"
            "671350 responive UI"
        ]
    }
    {
        id: "sourcemap"
        name: "SourceMap"
        blurb: "Generated JS to the original source"
        url: "https://wiki.mozilla.org/DevTools/Features/SourceMap"
        status: "Implementation"
        people: ["fitzgen"]
        bugs: [
            "618650 Map JS source coordinates to source language that was translated to JS"
            "674283 Add sourcemap URLs to JSScript"
            "673487 Add ability to map from original to generated source to SourceMapConsumer"
            "672312 Mini-require should be pulled out of GCLI so it can be shared with Source Map"
            "670002 use sourcemaps in the web console"
            "669999 Add a library for parsing and consuming source map files"
        ]
    }
    {
        id: "tilt"
        name: "Tilt"
        blurb: "WebGL DOM inspection awesomeness"
        url: "https://wiki.mozilla.org/Tilt_Project_Page"
        status: "Implementation"
        people: ["victor.porof"]
        bugs: [
            "659807 Implement Tilt: a WebGL-based 3D visualization of a webpage"
            "653658 JavaScript implementation of MOZ_dom_element_texture extension"
        ]
    }
    {
        id: "webconsole8"
        name: "Web Console 8"
        blurb: "Console refinement, remoting?"
        url: "https://wiki.mozilla.org/DevTools/Features/WebConsole8"
        status: "Planning"
        people: []
        bugs: [
            "672470 Fix memory leaks"
            "644596 expand console object with missing methods"
            "658368 Expand console object with time and timeEnd methods"
            "659625 Expand console object with clear method"
            "659907 Expand console object with dir method"
            "664131 Expand console object with group methods"
            "614586 Implement string substitution in console API methods"
            "669861 Cached errors and messages have wrong time stamp"
            "609890 Errors from before console is opened don't appear"
            "611032 Break out HUDConsoleObserver from HUDService"
            "612658 Implement ConsoleStorageService"
            "612252 Clear console keyboard shortcut"
            "655700 More visual separation between requests"
            "656231 cleanup the HUD object properties"
            "656709 Net toggle isn't tab-specific"
            "657932 lack of symmetry in handling of enter and escape keys"
            "592552 History is shared among all Web Console instances"
            "622303 Web Console should remember filter settings"
            "649350 Cleanup/reorganize the HUDService observers and listeners"
            "630460 command-w doesn't close inspector panels"
            "616586 Internal console logging API"
            "588871 Remove ConsoleStorage methods used for log message storage"
            "646816 command-w binding for dismissing panels"
            "656461 Web Console calls getters when displaying an object"
            "659931 Clicking on position button changes position"
            "660910 Autocompletion doesn't support this.x"
            "660864 completeNode is accepting keyboard input"
            "659775 command-w to close separate Web Console window"
            "663151 Display IP address and IP version in network panel"
            "663366 Full-screen web console is missing toolbar"
            "662807 Error bubbles in multiline messages in console look silly"
            "638949 Copy Location for URLs"
            "646028 Add debug filter item to the toolbar"
            "674229 Repeat bubbles are too close to source link"
            "673891 Convert message items to XBL"
            "673148 e10s"
            "670897 add inner windowID and timestamp to nsiScriptError2"
            "670857 deliberate uncaught exceptions will cause test failures in the future"
            "670140 browser_webconsole_bug611795.js leaks its content window"
            "664568 Allow ConsoleAPIStorage to keep logged messages in PB Mode"
            "664688 fails to track back/forward"
            "664466 sometimes hud is undefined in HS_deactivateHUDForContext"
            "663477 Can't close the Web Console window by repeating the keyboard shortcut: both windows are inactive"
            "662611 Console messages can freeze browser or tab"
        ]
    }
    {
        id: "scratchpad9"
        url: "https://wiki.mozilla.org/DevTools/Features/WorkspacesRefined"
        name: "Scratchpad 9"
        blurb: "The refined, humane way to engage in software development experiments."
        status: "Implementation"
        target: 8
        people: []
        bugs: [
            "636727 Add Ace to workspaces"
            "636731 Add GCLI commands for Workspaces"
            "644413 Workspaces should be able to restore their context via mode-line"
            "644409 Make scratchpads save their state across restarts"
            "651942 Add recent files to the file menu"
            "656273 Add a toolbar"
            "656330 make ctrl/cmd+enter execute command"
            "657303 F4 and esc should close the scratchpad window"
            "657132 Create a popup equivalent to the context menu in the status bar"
            "650760 Help menu"
            "653423 Undo option is grayed out although action is applicable"
            "653427 No save dialog displayed before closing window"
            "654023 Adding 'Tools' menu item to error console"
            "656544 More intuitive keyboard shortcuts"
            "656701 Scratchpad missing a menu overlay"
            "658006 Scratchpad breaks if you close the tab it's running in"
            "661289 Save file prompts twice to overwrite existing files"
            "663380 Restore Scratchpad after Firefox crash"
            "671982 automatically reload opened files where possible"
            "661762 Scratchpad source link may focus the wrong window"
            "669612 add indicator to window for unsaved changes"
            "669585 hide Environment->Content when devtools.chrome.enabled is false"
            "669400 Warning: use of getAttributeNode is deprecated"
            "669011 doesn't allow ctrl-shift-X to switch text direction"
            "663902 find a solution to draw negative margins"
            "667259 add new scratchpad context: remote content process"
        ]
    }
    {
        id: "webconsole9"
        name: "Web Console 9"
        status: "Planning"
        people: []
        bugs: [
            "672733 auto-complete search should be case insensitive"
        ]
    }
    {
        id: "cssdoctor"
        url: "https://wiki.mozilla.org/DevTools/Features/CSSDoctor"
        name: "Style Doctor"
        blurb: "The cure for what ails your CSS"
        status: "Implementation"
        people: ["jwalker"]
        bugs: [
            "656863 getShortSource() should guarantee uniqueness"
            "657350 'rule overridden by other rule' diagnosis"
            "658202 needs a way to select inline styles"
        ]
    }
    {
        id: "htmleditor"
        url: "https://wiki.mozilla.org/DevTools/Features/HTMLTreeEditor"
        name: "HTML Tree Editor"
        blurb: "Easy editing for simple changes to HTML"
        status: "Implementation"
        target: 8
        people: ["getify"]
        bugs: [
            "659710 add attribute editing"
        ]
    }
    {
        id: "debugger"
        url: "https://wiki.mozilla.org/DevTools/Features/Debugger"
        name: "Debugger"
        blurb: "A straightforward walk through your code"
        status: "Implementation"
        people: ["dcamp", "past", "jblandy", "jorendorff"],
        bugs: [
            "560314"
            "636907"
            "672829"
        ]
    }
    {
        id: "viewsource"
        name: "View Source Reboot"
        blurb: "The View Source of the Future"
        status: "Planning"
        people: []
        bugs: [
            "650893 New View Source component"
            "650895 Initial implementation of the new View Source tool"
            "246620 Add line numbers to view source"
            "482921 reimplement view source with HTML5 parser"
            "469434 copy link location"
            "660193 improve view-source for .js, .json, .css"
        ]
        notes: [
            "deminification"
            "insert alert"
            "view and edit?"
            "current source vs. original/cached"
        ]
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
    {
        id: "past"
        name: "Panagiotis Astithas"
        avatar: "http://gravatar.com/avatar/5910c2c56be9598a07535cc361b65a22"
        bugzillaId: "past@mozilla.com"
    }
    {
        id: "victor.porof"
        name: "Victor Porof"
        avatar: "http://gravatar.com/avatar/c0e3ca110aaf63386c3e520e614527c4"
        bugzillaId: "victor.porof@gmail.com"
        reviewCheck: false
    }
    {
        id: "bzbarsky"
        name: "Boris Zbarsky"
        avatar: "http://gravatar.com/avatar/8b86a9efd50a1c38bc4d3a0e47cd5979"
        bugzillaId: "bzbarsky@mit.edu"
    }
    {
        id: "jonas"
        name: "Jonas Sicking"
        avatar: "http://gravatar.com/avatar/12de552ffa2a81f8a03733071b70caaa"
        bugzillaId: "jonas@sicking.cc"
    }
    {
        id: "paul"
        name: "Paul Rouget"
        avatar: "http://gravatar.com/avatar/a046f67399acec21282d784ac66cb009"
        bugzillaId: "paul@mozilla.com"
    }
    {
        id: "fitzgen"
        name: "Nick Fitzgerald"
        avatar: "http://gravatar.com/avatar/6766096e8ae81ad6b3b82b9c12be19e0"
        bugzillaId: "nfitzgerald@mozilla.com"
    }
]
