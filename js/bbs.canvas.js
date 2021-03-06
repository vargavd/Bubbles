var bbs = bbs || {};
bbs.$elems = bbs.$elems || {};
bbs.utils = bbs.utils || {};

/* Canvas Module
 * Responsible for drawing the diagram, bubbles, titles and values onto a html5 canvas element. */

bbs.canvas = (function () {
    'use strict';
    var drawBubble, drawDiagram, initModule, clearCanvas, drawAxises,
        $canvas, ctx, canvasHeight, canvasWidth, addBubble,
        drawLine, drawText, drawRect, drawSquare, drawCircle, drawTriangle, renderTextForShape;

    clearCanvas = function () {
        var grd = ctx.createLinearGradient(canvasWidth,0,0,canvasHeight);
        grd.addColorStop(0, '#bbd');
        grd.addColorStop(1,'#eef');

        ctx.fillStyle = grd;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
    };
    drawDiagram = function (shapes, showTitles, showValues) {
        clearCanvas();
        $.each(shapes, function (i, shape) {
            shape.draw(shape.x, shape.y, shape.value, shape.color, shape.title, shape.value, shape.selected, showTitles, showValues);
            if (shape.selected) {
                shape.drawContact(shape.x, shape.y, shape.value);
            }
        });
        drawAxises();
    };
    drawAxises = function () {
        var x, y, layer;

        drawLine(0, 0, canvasWidth, 0, 5, '#444');
        drawLine(0, 0, 0, canvasHeight, 5, '#444');

        drawLine(canvasWidth-10, 10, canvasWidth, 0, 5, '#333');

        drawLine(10, canvasHeight-10, 0, canvasHeight, 5, '#333');

        for (x = 0; x < canvasWidth-10; x += 20) {
            drawLine(x, 0, x, 10, 2, '#333');
        }
        for (y = 0; y < canvasHeight-10; y += 20) {
            drawLine(0, y, 10, y, 2, '#333');
        }

        drawText(11, 15, '#111', 'Verdana, sans-serif', 12, '0');
        drawText(canvasWidth-19, 25, '#111', 'Verdana, sans-serif', 12, canvasWidth);
        drawText(26, canvasHeight-2, '#111', 'Verdana, sans-serif', 12, canvasHeight);
    };
    addBubble = function (bubble) {
        drawBubble(bubble.x, bubble.y, bubble.value, bubble.color);
    };
    drawLine = function (x1, y1, x2, y2, width, color) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.stroke();
    };
    drawText = function (x, y, color, fontFamily, fontSize, text) {
        ctx.beginPath();
        ctx.font = fontSize + 'px ' + fontFamily;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y);
    };
    renderTextForShape = function (x, y, title, value, color, selected, showTitle, showValue) {
        if (showTitle) {
            if (selected) {
                drawText(x, y-value-3, 'red', 'Verdana, sans-serif', 12, title);
            }
            else {
                drawText(x, y-value-3, 'black', 'Verdana, sans-serif', 12, title);
            }
        }
        if (showValue) {
            drawText(x, y+4, color, 'Verdana, sans-serif', 12, value);
        }
    };
    drawCircle = function (x, y, r, fillStyle = "rgba(255, 100, 100, 0.2)") {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = fillStyle;
        ctx.fill();
    };
    drawRect = function (x, y, a, b, fillStyle = "rgba(255, 100, 100, 0.2)") {
        ctx.beginPath();
        ctx.fillStyle = fillStyle;
        ctx.fillRect(x, y, a, b);
    };
    drawBubble = function (x, y, radius, color, title, value, selected, showTitle, showValue) {
        var grd = ctx.createRadialGradient(x, y, 1, x, y, radius*1.4);
        grd.addColorStop(0, "white");
        grd.addColorStop(1, color);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = grd;
        ctx.fill();

        renderTextForShape(x, y, title, value, color, selected, showTitle, showValue);
    };
    drawSquare = function (x, y, radius, color, title, value, selected, showTitle, showValue) {
        var grd = ctx.createRadialGradient(x, y, 1, x, y, radius*1.4), sq;
        grd.addColorStop(0, "white");
        grd.addColorStop(1, color);

        sq = bbs.math.getSquareInfo(x, y, radius);
        
        ctx.beginPath();
        ctx.fillStyle = grd;
        ctx.fillRect(sq.x1, sq.y1, sq.side, sq.side);

        renderTextForShape(x, y, title, value, color, selected, showTitle, showValue);
    };
    drawTriangle = function (x, y, radius, color, title, value, selected, showTitle, showValue) {
        var grd = ctx.createRadialGradient(x, y, 1, x, y, radius*1.4), tr;
        grd.addColorStop(0, "white");
        grd.addColorStop(1, color);

        tr = bbs.math.getIsoscelesTriangleInfo(x, y, radius);

        ctx.beginPath();
        ctx.fillStyle = grd;
        ctx.moveTo(tr.x1, tr.y1);
        ctx.lineTo(tr.x2, tr.y2);
        ctx.lineTo(tr.x3, tr.y3);
        ctx.fill();

        renderTextForShape(x, y, title, value, color, selected, showTitle, showValue);
    };

    initModule = function () {
        $canvas = bbs.$elems.canvas();
        canvasWidth = $canvas.width();
        canvasHeight = $canvas.height();
        ctx = $canvas[0].getContext("2d");

        drawDiagram([]);
    };


    return {
        init: initModule,
        render: drawDiagram,
        addBubble: addBubble,
        drawBubble: drawBubble,
        drawSquare: drawSquare,
        drawTriangle: drawTriangle,
        drawRect: drawRect,
        drawCircle: drawCircle
    };
}());