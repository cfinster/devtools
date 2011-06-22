---
title: Developer Tools 2011
layout: page
---

# Developer Tools 2011 #

Kevin Dangoor <kdangoor@mozilla.com>
June 14, 2011

This document is the revised edition of the roadmap from January, 2011. The high level goals for the plan have not changed, but a number of the details have as we've dug into the implementation and grown our efforts.

## Vision ##

The ultimate goal is to **make Firefox the best dynamic environment for building modern web applications**. In 2011, we'll take the first steps along that path.

This year, we want to:

1. **Include tools with Firefox that will help with the most common web development tasks**
2. **Prepare to allow a variety of tools to easily be built on multi-process Firefox**

To accomplish our goals for this year and set the stage for the challenging work that follows, we will take an approach that:

* **Enables web developers to easily help with making the tools they use better**
* **Gathers feedback via frequent releases**

## Our Priorities ##

1. Help web developers on electrolysis-based desktop Firefox (see "More Complex Firefox Process Model" below)
2. Help Jetpack developers debug their add-ons
3. Help web developers create their mobile apps on with Firefox for mobile (with remote debugging interfaces)
4. Help Firefox developers debug the browser
5. Help developers of other Mozilla platform projects

Jetpacks and Firefox itself are built on many of the same technologies as the web. The same SpiderMonkey JavaScript engine that runs JS code on web pages is also responsible for a great deal of the Firefox user interface and for running Jetpacks. Where possible, we will engineer our work to support anyone who is building on the Mozilla platform, but our top priority for 2011 is to delight people building web applications.

## Bundled Tools for the Most Common Tasks ##

Firefox has a great add-on ecosystem, and we want to encourage the creation of even more add-ons for web developers. The needs of modern web sites and applications are far more significant than they used to be, and we'll rely on add-ons for handling many of the less common cases.

With that in mind, we do want Firefox to be a developer-friendly browser out-of-the-box. For a web developer, a browser without tools is useless. Every build of Firefox (Nightly, Aurora, Beta and final releases) should have functional tools.

One goal we have for our tools is to offer "task-oriented" user interfaces. While it's important to dump the available information in some UI so that a web developer can figure out whatever they need to, we think the software can go farther to give the user direct solutions to common problems.

More specifically,

* Easy-to-use tools for diagnosing and correcting problems with page styling
* A debugger for analyzing and correcting problems in JavaScript code
* Views into the performance characteristics of an application

## Supporting Open Web Standards via Tools ##

Ideally, every person using web sites and applications is using a modern browser with support for the latest standards. Of course, even this ideal scenario falls short of the ideal: what are the "latest standards"? HTML is a living standard and there has been considerable churn in areas like Web Sockets and IndexedDB vs. Web SQL Database.

Among the many user interface challenges that we face, we want our tools to:

1. provide support for and encourage users to develop for the latest standards supported by modern browsers
2. assist users in making good tradeoffs when they need to support older browsers

Most web developers are given constraints concerning which browsers they must support, with some developers saddled with a requirement to support a decade old browser. If we can help developers both provide support for the browsers they are required to support *and* take advantage of newer browser features, we will be making the web a better place.

This won't be easy, and I won't even dive into specifics on how to do this here. I'm writing this as a guideline that we can apply and one more thing to think about as we design new tools.

## More Complex Firefox Process Model ##

Our "electrolysis" (e10s) project, which aims to change Firefox to a multi-process model in 2011, will have a significant impact on developer tools. We need to ensure that there is a solid collection of developer tools when the multi-process Firefox ships.

The tools that ship with Firefox will be ready for e10s when the switchover is made, and we will look for opportunities to help web developer tool add-on authors prepare their tools as well.

There is a second shift that is happening at the same time: the increased importance of mobile browsers including Firefox for Mobile. Due to the screen size limitations of mobile devices, we're effectively going from a "single layer" developer tools model to one with three layers:

-- single firefox process --

-- developer tools UI -- Firefox chrome process -- Firefox content process

## Frequent Releases ##

The rapid release cycle adopted after Firefox 4 enables us to get new features out the door every 6 weeks. This is a huge change from a Firefox 4-style cycle and will enable us to iterate and improve built-in tools much faster than before.

For experimental new tools, we will consider releasing the tools as add-ons first to get fast feedback. Once the tool is stable and appears to have broad appeal, we'll bring it into the product.

## Empowering Web Developers ##

The users of developer tools are all developers. Many of them know HTML, CSS and JavaScript very well indeed, and we will strive to make it as easy as possible for them to:

# extend the tools that ship with Firefox
# improve/contribute to the tools that ship with Firefox
# build entirely new tools of their own

# Roadmap #

We're nearly halfway through the year as I write this, so I will report on how the first half has gone and we'll move forward in the second half of the year.

## Looking back ##

In Q1, our main goal was to ship Firefox 4 with the Web Console and to ensure that a Firefox 4-compatible version of Firebug was shipped at the same time. We hit those goals.

We also released the "Workspaces" add-on which later evolved into Scratchpad, a feature in Firefox 6.

During the first quarter, we also made an important discovery: the Add-on SDK (Jetpack) is not the best platform at this stage for the kinds of tools we're building. We also wanted to spend more of our time building tools at this stage and less time on infrastructure. So, we changed gears and started developing tools as standard Firefox features.

With that new plan in hand, we went to work building new tools and improving the Web Console. The Firefox 7 Web Console is considerably more refined than that of Firefox 4 and the "console" object provided to web pages is now in line with the de facto standard. We also have a collection of tools to help developers work with the styling of their pages that will be shipping soon.

Finally, the Firebug 1.7.2 release is compatible with Firefox 3.6, 4 and the upcoming 5. Firebug 1.8 is due around the time of Firefox 5's release and is planned to be compatible with Firefox 6 as well.

## Looking forward ##

For the second half of the year, we will need to build on the base of tools that we've created and refine them to meet our overall goals. In the second half of the year, we need to ship:

* the debugger
* performance-related tools
* e10s-ready versions of the tools
* mobile compatible versions of core tools (the Web Console, styling and performance related tools)

These are substantial new areas that we will push into. We will undoubtedly refine the tools built in the first half of the year, and we will likely seek opporunities to start improving the developer experience for Jetpacks and Apps.

Work has already started on getting Firebug ready for e10s and remote access and that work will likely start appearing in Firebug 1.9.

With our tools developed during the first half of the year as a base, we will start making it easier for web developers to get involved in improving the tools they use day-to-day.