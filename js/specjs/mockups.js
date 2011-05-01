(function() {
  var _ref;
  this.specjs = (_ref = this.specjs) != null ? _ref : {};
  this.specjs.initializeMockup = function() {
    var canvas, ctx, editor, el, elem, height, inLeft, inOffset, inTop, inspectedEl, left, mode, option, options, top, width, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _ref4, _results;
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
    $("body").drawArrows();
    _ref4 = $(".editor");
    _results = [];
    for (_k = 0, _len3 = _ref4.length; _k < _len3; _k++) {
      elem = _ref4[_k];
      editor = ace.edit(elem);
      options = elem.getAttribute("data-editor-options");
      _results.push((function() {
        var _i, _len, _results;
        if (options) {
          options = options.split(',');
          _results = [];
          for (_i = 0, _len = options.length; _i < _len; _i++) {
            option = options[_i];
            _results.push((function() {
              switch (option) {
                case 'html':
                  mode = require('ace/mode/html').Mode;
                  return editor.getSession().setMode(new mode());
                case 'readonly':
                  return editor.setReadOnly(true);
                case 'css':
                  mode = require('ace/mode/css').Mode;
                  return editor.getSession().setMode(new mode());
              }
            })());
          }
          return _results;
        }
      })());
    }
    return _results;
  };
  $.fn.drawArrows = function() {
    var el, height, left, r, top, width, _ref;
    if (!(typeof Raphael != "undefined" && Raphael !== null)) {
      return;
    }
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
