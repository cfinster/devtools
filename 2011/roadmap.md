---
title: Developer Tools 2011
layout: page
---

# Developer Tools 2011 #

Kevin Dangoor <kdangoor@mozilla.com>
May 27, 2011

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

1. Help web developers on electrolysis-based (see "Multi-Process Firefox" below) desktop Firefox
2. Help Jetpack developers debug their add-ons
3. Help web developers create their mobile apps on with Firefox for mobile (with remote debugging interfaces)
4. Help Firefox developers debug the browser
5. Help developers of other Mozilla platform projects

Jetpacks and Firefox itself are built on many of the same technologies as the web. The same SpiderMonkey JavaScript engine that runs JS code on web pages is also responsible for a great deal of the Firefox user interface and for running Jetpacks. Where possible, we will engineer our work to support anyone who is building on the Mozilla platform, but our top priority for 2011 is to delight people building web applications.

## Bundled Tools for the Most Common Tasks ##

Firefox has a great add-on ecosystem, and we want to encourage the creation of even more add-ons for web developers. The needs of modern web sites and applications are far more significant than they used to be, and we'll rely on add-ons for handling many of the less common cases.

With that in mind, we do want Firefox to be a developer-friendly browser out-of-the-box. For a web developer, a browser without tools is useless. Every build of Firefox (releases, Nightly, Aurora, and Beta) should have functional tools.

One goal we have for our tools is to offer "task-oriented" user interfaces. While it's important to dump the available information in some UI so that a web developer can figure out whatever they need to, we think the software can go farther to give the user direct solutions to common problems.

More specifically,

* Easy-to-use tools for diagnosing and correcting problems with page styling
* A debugger for analyzing and correcting problems in JavaScript code
* Views into the performance characteristics of an application

## Supporting Open Web Standards via Tools ##

Ideally, every person using web sites and applications is using a modern browser with support for the latest standards. Of course, even this ideal scenario falls short of the ideal: what are the "latest standards"? The "HTML5" standard is still evolving and there has been considerable churn in areas like Web Sockets and IndexedDB vs. Web SQL Database.

Among the many user interface challenges that we face, we want our tools to:

1. provide support for and encourage users to develop for the latest standards supported by modern browsers
2. assist users in making good tradeoffs when they need to support older browsers

Most web developers are given constraints concerning which browsers they must support, with some developers saddled with a requirement to support a nearly decade old browser. If we can help developers both provide support for the browsers they are required to support *and* take advantage of newer browser features, we will be making the web a better place.

This won't be easy, and I won't even dive into specifics on how to do this here. I'm writing this as a guideline that we can apply and one more thing to think about as we design new tools.

## Multi-Process Firefox ##

Our "electrolysis" (e10s) project, which aims to change Firefox to a multi-process model in 2011, will have a significant impact on developer tools. We need to ensure that there is a solid collection of developer tools when the multi-process Firefox ships.

We will need to ensure that the tools that ship with Firefox are ready for e10s when the switchover is made. We will also look for opportunities to help web developer tool add-on authors prepare their tools for e10s.

## Frequent Releases ##

The rapid release cycle adopted after Firefox 4 enables us to get new features out the door every 6 weeks. This is a huge change from a Firefox 4-style cycle and will enable us to iterate and improve built-in tools much faster than before.

For experimental new tools, we will consider releasing the tools as add-ons first to get fast feedback, and then once the tool is stable and appears to have broad appeal, we'll bring it into the product.

## Empowering Web Developers ##

The users of developer tools are all developers. Many of them know HTML, CSS and JavaScript very well indeed, and we will strive to make it as easy as possible for them to:

# extend the tools that ship with Firefox
# improve/contribute to the tools that ship with Firefox
# build entirely new tools of their own

# Roadmap #

This is a high-level view of how we see 2011 going:

## Q1 (March 31) ##

* Ship Firefox 4 with the Web Console (done!)
* Ship Firebug 1.7 which is compatible with Firefox 4 (done!)
* Release initial devtools SDK with a small scope (back burner)
* Release an initial tool as a Jetpack (sort of)

During Q1, we discovered that the Add-on SDK (Jetpack) is not ideal at this stage for the kinds of tools we were building. Consequently, we shifted our focus away from the devtools SDK to building tools directly as Firefox features.

We did release the Scratchpad tool as a traditional add-on in Q1. This tool ships in Firefox 6.

## Q2 (June 30) ##

* Expand the devtools SDK (back burner)
* Release Web Console and Inspector updates on the expanded SDK (scrapped - sort of)
* Initial prototype debugger (in-progress)
* Portions of Firebug run as a Jetpack on top of the devtools SDK (scrapped)

While we do plan to have a devtools SDK (or, more specifically, devtools-oriented APIs that are a part of the Add-on SDK), this is on hold until we get more tools out.

With that change in plans relative to the SDK, we are leaving the Web Console and Highlighter (formerly Inspector) as native Firefox features.

## Q3 (September 30) ##

* devtools SDK-based tools should run atop the e10s Firefox beta
* Firefox beta with SDK-based tools integrated
* Improve the integration of the tools and add features based on feedback
* Another new tool (something like performance or memory profiling)
* Flesh out the debugger
* Get the remainder of Firebug standing on the devtools SDK

## Q4 (December 31) ##

* Firefox e10s ships with integrated tools
* Companion Firebug release ships
