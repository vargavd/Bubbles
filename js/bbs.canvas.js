var bbs = bbs || {};
bbs.$elems = bbs.$elems || {};
bbs.utils = bbs.utils || {};

/* Canvas Module
 * Responsible for drawing the diagram, bubbles, titles and values onto a html5 canvas element. */

bbs.canvas = (function () {
    'use strict';
    var drawBubble, drawDiagram, initModule, clearCanvas, drawAxises,
        $canvas, ctx, canvasHeight, canvasWidth, addBubble,
        drawLine, drawText;

    clearCanvas = function () {
        var grd = ctx.createLinearGradient(canvasWidth,0,0,canvasHeight);
        grd.addColorStop(0, '#bbd');
        grd.addColorStop(1,'#eef');

        ctx.fillStyle = grd;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
    };
    drawDiagram = function (bubbles, showTitles, showValues) {
        clearCanvas();
        $.each(bubbles, function (i, bubble) {
            drawBubble(bubble.x, bubble.y, bubble.value, bubble.color, bubble.title, bubble.value, bubble.selected, showTitles, showValues);
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
    drawBubble = function (x, y, radius, color, title, value, selected, showTitle, showValue) {
        var grd = ctx.createRadialGradient(x, y, 1, x, y, radius*1.4);
        grd.addColorStop(0, "white");
        grd.addColorStop(1, color);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = grd;
        ctx.fill();

        if (showTitle) {
            if (selected) {
                drawText(x, y-radius-3, 'red', 'Verdana, sans-serif', 12, title);
            }
            else {
                drawText(x, y-radius-3, 'black', 'Verdana, sans-serif', 12, title);
            }

        }
        if (showValue) {
            drawText(x, y+4, color, 'Verdana, sans-serif', 12, value);
        }
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
        addBubble: addBubble
    };
}());