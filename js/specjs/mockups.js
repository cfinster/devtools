(function() {
  var _ref;
  this.specjs = (_ref = this.specjs) != null ? _ref : {};
  this.specjs.initializeMockup = function() {
    var canvas, ctx, el, height, inLeft, inOffset, inTop, inspectedEl, left, top, width, _i, _j, _len, _len2, _ref, _ref2, _ref3;
    console.log("initializing mockup");
    _ref = $('.inspector');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      el = $(el);
      _ref2 = el.offset(), left = _ref2.left, top = _ref2.top;
      width = el.outerWidth();
      height = el.outerHeight();
      canvas = $('<canvas>', {
        style: "position: absolute; left: " + left + "px; top: " + top + "px;",
        width: width.toString(),
        height: height.toString()
      });
      canvas = canvas[0];
      ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
      ctx.fillRect(0, 0, width, height);
      _ref3 = $('.inspected', el);
      for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
        inspectedEl = _ref3[_j];
        inspectedEl = $(inspectedEl);
        inOffset = inspectedEl.offset();
        inLeft = inOffset.left;
        inTop = inOffset.top;
        inLeft = inLeft - left;
        inTop = inTop - top - 15;
        width = inspectedEl.width();
        height = inspectedEl.height() + 15;
        ctx.clearRect(inLeft, inTop, width, height);
      }
      $("body").append(canvas);
    }
    return $("body").drawArrows();
  };
  $.fn.drawArrows = function() {
    var el, height, left, r, top, width, _ref;
    el = $(this);
    _ref = el.offset(), left = _ref.left, top = _ref.top;
    width = el.outerWidth();
    height = el.outerHeight();
    r = Raphael(left, top, width, height);
    return $("span", el).each(function() {
      var arrowTo, fromOffset, p, span, targetId, toOffset, _i, _len, _results;
      span = this;
      arrowTo = span.getAttribute("data-arrowTo");
      if (!arrowTo) {
        return;
      }
      fromOffset = $(span).offset();
      arrowTo = arrowTo.split(",");
      _results = [];
      for (_i = 0, _len = arrowTo.length; _i < _len; _i++) {
        targetId = arrowTo[_i];
        toOffset = $("#" + targetId).offset();
        p = r.path("M" + (fromOffset.left - left) + " " + (fromOffset.top - top) + "L" + (toOffset.left - left) + " " + (toOffset.top - top));
        _results.push(p.attr({
          "arrow-end": "classic-wide-long"
        }));
      }
      return _results;
    });
  };
  $(this.specjs.initializeMockup);
}).call(this);
