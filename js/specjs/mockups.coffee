@specjs = @specjs ? {}

@specjs.initializeMockup = () ->
    console.log "initializing mockup"

    for el in $('.inspector')
        el = $ el
        {left, top} = el.offset()
        width = el.outerWidth()
        height = el.outerHeight()

        canvas = $ '<canvas>',
            style: "position: absolute; left: #{left}px; top: #{top}px;"
            width: width.toString()
            height: height.toString()
        
        canvas = canvas[0]
        ctx = canvas.getContext "2d"
        ctx.fillStyle = "rgba(0, 0, 200, 0.5)"
        ctx.fillRect 0, 0, width, height

        for inspectedEl in $('.inspected', el)
            inspectedEl = $ inspectedEl
            inOffset = inspectedEl.offset()
            inLeft = inOffset.left
            inTop = inOffset.top

            inLeft = inLeft - left
            # subtracting the margin at the bottom. this seems wrong.
            inTop = inTop - top - 15
            width = inspectedEl.width()

            # the following isn't right, but I don't care
            # at the moment...
            height = inspectedEl.height()+15
            ctx.clearRect inLeft, inTop, width, height

        $("body").append(canvas)
    
    $("body").drawArrows()


$.fn.drawArrows = () ->
    el = $ @
    {left, top} = el.offset()
    width = el.outerWidth()
    height = el.outerHeight()

    r = Raphael left, top, width, height
    
    $("span", el).each(() ->
        span = @
        arrowTo = span.getAttribute "data-arrowTo"
        if not arrowTo
            return
        
        fromOffset = $(span).offset()
        arrowTo = arrowTo.split(",")
        for targetId in arrowTo
            toOffset = $("##{targetId}").offset()
            p = r.path("M#{fromOffset.left - left} #{fromOffset.top - top}L#{toOffset.left - left} #{toOffset.top - top}")
            p.attr {"arrow-end": "classic-wide-long"}
    )

$ @specjs.initializeMockup
