---
title: Devtools Installation
layout: page
---

# Devtools Installation #

## Summary ##

With the exception of the Web Console, which will remain where it is for the
time being, our intention is to have the Developer menu in Firefox offer just
an "Install Developer Tools" option. The user clicks that and gets the 
"standard set" of developer tools. The user will also have the option of 
opting in to beta or nightly developer tools.

By producing the developer tools as add-ons, we acheive a few things:

1. web developers can use a stable browser with beta tools – chance to get the latest tools while still running the browser that their users are running
2. web developers can try out new, experimental tools easily
3. non-developer users of Firefox (the *vast majority* don't need to have a larger download because of the tools)
4. we will ensure the most power possible for people who want to create or improve devtools addons by being consumers of devtools-oriented APIs ourselves

Firefox's powerful add-on platform makes this approach work well with automatic updates and selective removal of add-ons the user doesn't want.

## Developer Menu ##

The Developer menu will start off with 3 menu items:

<div style="border: 1px solid black; padding: 5px">
Web Console<br>
Error Console<br>
Install Developer Tools
</div>

Eventually, this can be reduced to a single initial menu item ("Install Developer Tools"). When the user selects "Install Developer Tools", the DevTools Add-on is installed (see below) and the menu changes to something like:

<div style="border: 1px solid black; padding: 5px">
Web Console<br>
Error Console<br>
Highlighter<br>
(Random Other Tool)<br>
Switch to Beta Tools
</div>

"Switch to Beta Tools" will switch the installed devtools add-ons to the beta channel versions. If this option is selected, the menu item will change to "Switch to Stable Tools".

## DevTools Add-on ##

The DevTools Add-on will provide two features:

1. install the standard set of add-ons (including new add-ons that are added to the set)
2. displaying changelog information from the devtools add-ons

The standard Add-ons Manager will be used to keep devtools up to date and remove them if the user no longer wants them. If the user removes a tool, the DevTools Add-on will not attempt to reinstall it.

As devtools add-ons are updated, they will be able to register a list of changes since the previous installed version. Each of those changes will be a simple string with an optional link to more information about the change (this could be HTML as long as we're sure that HTML is displayed in a non-priveleged context). All of those changes will be compiled into a single changelog that is displayed to the user.

**Question** how do we prevent restartless add-ons from causing the changelog dialog box to appear independently for each tool?
