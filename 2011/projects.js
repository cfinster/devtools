// This is the project data for the status.html page

(function(exports) {

exports.estimates = {
    "577721": [6, 12, 16],
    "585991": [1, 2, 4],
    "637801": [1, 1, 2],
    "638949": [4, 8, 16],
    "614586": [8, 16, 24],
    "646025": [8, 16, 48],
    "646028": [4, 6, 8],
    "585956": [8, 16, 24],
    "637131": [4, 8, 16],
    "592552": [1, 3, 4],
    "642112": [2, 4, 8],
    "622303": [4, 6, 12]
};

exports.projects = [
    {
        id: "console5",
        url: "https://wiki.mozilla.org/DevTools/Features/WebConsole5",
        name: "Web Console '5'",
        blurb: "Adding awesome to the existing Web Console",
        status: "Implementation",
        people: ["ddahl", "msucan"],
        bugs: [
            577721,
			585991,
			637801,
			632347,
			632275,
			644596,
			618311,
			638949,
			"642108 JS errors from HUD in Error Console",
			609890,
			611032,
			612658,
			595223,
			626484,
			619598,
			612252,
			614586,
			642615,
			646025,
			646028,
			"616742 Implement console.debug",
			"585956 Implement console.trace() in web console",
			"644419 Console should have user-settable log limits for each message category",
			"642108 JS errors from HUD in Error Console",
			"642109 Web Console REPL 'readline' occasionally stops working right",
			"642111 Web Console messages should scroll into view automatically",
			645163,
			"637131 Unexpected load of chrome://browser/content/browser.xul when using the Web Console (Ctrl-Maj-K)"
        ]
    },
    {
        id: "workspaces",
        url: "https://wiki.mozilla.org/DevTools/Features/Workspaces",
        name: "Workspaces First Take",
        blurb: "The humane way to monkey with code",
        status: "Implementation",
        people: ["msucan", "rcampbell"],
        bugs: [
            "642176 Integrate Workspace extension into the browser",
            "636725 Unit tests for Workspaces",
			"646070 Respect chrome developer tools preference in workspace"
        ],
        updates: [
		    "2011/03/18 Patch to put the Workspaces in browser",
            "2011/03/01 Prototype is working as a Jetpack",
            "2011/01/05 Initial Prototype Add-On"
        ]
    },
    {
        id: "memoryback",
        url: "https://wiki.mozilla.org/DevTools/Features/Memory",
        name: "Memory Tooling Backend",
        blurb: "Data for the future",
        status: "Planning",
        people: ["dcamp"],
        bugs: [
            646734,
            646735,
            646737,
            646739
        ]
    },
    {
        id: "highlighter",
        url: "https://wiki.mozilla.org/DevTools/Features/Highlighter",
        name: "Highlighter",
        blurb: "Beautiful information about your DOM",
        status: "Planning",
        people: ["rcampbell"],
        bugs: [
            642471
        ]
    },
    {
        id: "gcli",
        url: "https://wiki.mozilla.org/DevTools/Features/GCLI",
        name: "Graphical Command Line Interface",
        blurb: "The fastest, most discoverable way to control your tools",
        status: "Prototype",
        people: ["jwalker"],
        bugs: [
		    641903,
		    642505,
		    "642231 Prepare GCLI for review",
		    "642241 Experiment with better UI presentation methods in GCLI",
		    "642401 Ace/Pilot/GCLI doesn't have a good definition of pref scopes",
		    "642400 Ace/Pilot/GCLI doesn't have a good definition of the environment",
		    "642242 GCLI should embed help as commands",
		    "642240 GCLI needs some form of URI for reference to everything",
		    "642239 GCLI should have history retention",
		    "642238 GCLI metadata should have types on return values",
		    "642237 GCLI should display its opening command menu in a hierarchy",
		    "642226 GCLI should support use without an input element",
		    "642196 GCLI should allow JS to be entered using {}",
		    "642189 GCLI should support grouped parameters"
        ]
    },
    {
        id: "styleinspector",
        url: "https://wiki.mozilla.org/DevTools/Features/StyleInspector",
        name: "Style Inspector",
        blurb: "View an element's style, in style!",
        status: "Planning",
        people: []
    },
    {
        id: "styledoctor",
        url: "https://wiki.mozilla.org/DevTools/Features/StyleDoctor",
        name: "Style Doctor",
        blurb: "The cure for what ails your CSS",
        status: "Planning",
        people: ["jwalker"]
    },
    {
        id: "cssedit",
        name: "CSS Editor",
        blurb: "Tweak and view!",
        status: "Planning",
        people: [],
        bugs: []
    },
    {
        id: "sdk",
        url: "https://wiki.mozilla.org/DevTools/Features/SDK",
        name: "DevTools SDK 1",
        blurb: "First bits of customizability",
        status: "Planning",
        bugs: [
		    639518,
		    638871,
		    638131,
		    638142,
		    637291
        ]
    },
    {
        id: "viewsource",
        name: "View Source Reboot",
        blurb: "The View Source of the Future",
        status: "Planning",
        people: [],
        bugs: [],
        notes: [
            "deminification",
            "insert alert",
            "view and edit?",
            "current source vs. original/cached"
        ]
    },
    {
        id: "gauges",
        name: "Gauges",
        blurb: "Page performance at-a-glance",
        status: "Planning",
        people: [],
        bugs: []
    },
    {
        id: "firebug6",
        name: "Firebug Platform Improvements",
        status: "Planning",
        people: [],
        bugs: [
            580880,
            524674,
			638075,
			634073,
			529536,
			526207,
			641236,
			641234,
			"642136 Debugger access to closure environments",
			"642801 Firefox 4.0 Crash Report [@ SelectorMatches ]",
			"645160 [regression] Incorrect jsdIStackFrame for eval() calls (breaks Dojo)"
        ]
    },
    {
        id: "jsd2",
        url: "https://wiki.mozilla.org/DevTools/Features/JSD2",
        name: "JSD2",
        blurb: "Debugging the multiprocess world",
        status: "Planning",
        people: ["jblandy"],
        bugs: [
		    "560314",
		    "636907"
        ]
    },
    {
        id: "ui",
        url: "https://wiki.mozilla.org/DevTools/Features/OverallUI",
        name: "Overall UI",
        blurb: "The way things fit together",
        status: "Planning",
        people: [],
        bugs: [
            554926
        ],
        updates: [
            "2011/02/24 Quick mockups added"
        ]
    },
    {
        id: "webconsole6",
        url: "https://wiki.mozilla.org/DevTools/Features/WebConsole6",
        name: "Web Console 6",
        blurb: "Console Cleanup and Integration",
        status: "Planning",
        people: [],
        bugs: [
		    "646504 Global console should have decent display of stack traces",
		    "587757 Implement Browser Console",
		    "592552 History is shared among all Web Console instances",
		    "642112 Web Console checkmarks do not reliably display their state",
		    "622303 Web Console should remember filter settings"
        ]
    },
    {
        id: "workspaces6",
        url: "https://wiki.mozilla.org/DevTools/Features/WorkspacesRefined",
        name: "Workspaces Refined",
        blurb: "The refined, humane way to engage in software development experiments.",
        status: "Planning",
        people: [],
        bugs: [
			"646524 cache the sandboxes",
            "636727 Add Ace to workspaces",
            "636731 Add GCLI commands for Workspaces",
			"644413 Workspaces should be able to restore their context via mode-line",
			"644409 Make workspaces save their state across restarts"
        ]
    },
    {
        id: "incontent",
        name: "In-Content Tools",
        blurb: "Improved support for browser content-based tools",
        status: "Planning",
        people: [],
        bugs: [
            638452
        ]
    },
    {
        id: "objectinspector",
        name: "Object Inspector Plus",
        blurb: "Take a look inside!",
        status: "Planning"
    }
];

exports.people = [
    {
        id: "muscan",
        name: "Mihai Sucan",
        avatar: "http://a2.twimg.com/profile_images/326719609/avatar_robodesign_v5_reasonably_small.png"
    },
    {
        id: "rcampbell",
        name: "Rob Campbell",
        avatar: "http://gravatar.com/avatar/34f8f3442a6be7ae2cb26459a2e33fc1"
    },
    {
        id: "jwalker",
        name: "Joe Walker",
        avatar: "http://gravatar.com/avatar/8dd47f0c426cd8204b8bf996cb98cb56"
    },
    {
        id: "ddahl",
        name: "David Dahl",
        avatar: "http://a0.twimg.com/profile_images/1090231487/Selection_001_reasonably_small.png"
    },
    {
        id: "dcamp",
        name: "Dave Camp",
        avatar: "http://a1.twimg.com/profile_images/28279492/campd_bigger.png"
    },
    {
        id: "kdangoor",
        name: "Kevin Dangoor",
        avatar: "http://gravatar.com/avatar/f4749cce627b584fb9e59966a5d2c924"
    },
    {
        id: "jodvarko",
        name: "Jan Odvarko",
        avatar: "http://gravatar.com/avatar/34b251cf082c202fb3160b1afb810001"
    },
    {
        id: "jblandy",
        name: "Jim Blandy",
        avatar: "http://www.red-bean.com/jimb/jimb.jpg"
    }
];

})(this);