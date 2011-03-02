---
title: Highlighter
layout: page
---

# Highlighter #

The Inspector is a web designer-oriented feature that was initially planned
for Firefox 4 but was not ready in time to ship. The code was written before
the DevTools SDK and was left in an inactive state in the Firefox tree.

We are going to rebuild the Inspector on top of the DevTools SDK and plan
to take the UI in different directions than the original planned Inspector.

As originally conceived, the Inspector was a tool that allowed the visual
selection of an element and a set of panels that work with that element.
The revised concept is a "Highlighter" that is just the visual selector o
f elements with the ability to overlay additional information directly 
over the page being inspected. Separate tools (Style Doctor, Style Inspector, 
etc.) will work with the selected elements.
