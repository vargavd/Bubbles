/**
 * Created by VvD on 2014.03.23..
 */

/* Bubbles - A fun bubble diagram. */

var bbs = (function () {
    'use strict';
    var initModule, bubbles, bubbleId = 0, canvasOffset, render,
        addBubble, rightClick, selectBubble, deselectBubble, changeInputValue, colorChange,
        mouseDown, mouseUp, mouseMove,
        showTitles, showValues,
        bubblePressed = false, selectedBubbleIndex = null, lastMouseX, lastMouseY;

    render = function () {
        bbs.canvas.render(bubbles, showTitles(), showValues());
    };
    showTitles = function () {
        return bbs.$elems.bubblesTitles().is(":checked");
    };
    showValues = function () {
        return bbs.$elems.bubblesValues().is(":checked");
    };
    addBubble = function (e) {
        if (selectedBubbleIndex !== null) {
            bubbles[selectedBubbleIndex].selected = false;
        }

        selectedBubbleIndex = bubbles.length;

        bubbles.push({
            x: e.pageX - canvasOffset.left,
            y: e.pageY - canvasOffset.top,
            value: parseInt(bbs.$elems.bubbleValueInput().val(), 10),
            color: bbs.$elems.bubbleColorInput().val(),
            title: bbs.$elems.bubbleTitleInput().val(),
            id:  ++bubbleId,
            selected: true
        });



        render();
    };
    rightClick = function (e) {
        var i,
            mouseX = e.pageX-canvasOffset.left,
            mouseY = e.pageY-canvasOffset.top;

        e.preventDefault();

        for (i = bubbles.length-1; i >= 0; i--) {
            if (bubbles[i].value > Math.sqrt(Math.pow(mouseX - bubbles[i].x, 2) + Math.pow(mouseY - bubbles[i].y, 2))) {
                bubbles.splice(i, 1);
                break;
            }
        }

        deselectBubble();
        render();
    };
    selectBubble = function () {
        var i, bubble;

        for (i = selectedBubbleIndex; i < bubbles.length - 1; i++) {
            bubble = bubbles[i+1];
            bubbles[i+1] = bubbles[i];
            bubbles[i] = bubble;
        }

        selectedBubbleIndex = bubbles.length - 1;
        bubble = bubbles[selectedBubbleIndex];

        bbs.$elems.bubbleTitleInput().val(bubble.title);
        bbs.$elems.bubbleValueInput().val(bubble.value);
        bbs.$elems.bubbleXInput().val(bubble.x);
        bbs.$elems.bubbleYInput().val(bubble.y);
        bbs.$elems.setBubbleColorInput(bubble.color);

        for (i = 0; i < bubbles.length - 1; i++) {
            bubbles[i].selected = false;
        }

        bubble.selected = true;
        render();
    };
    deselectBubble = function () {
        bbs.$elems.bubbleTitleInput().val("Bubble Title");
        bbs.$elems.bubbleValueInput().val("50");
        bbs.$elems.bubbleXInput().val("");
        bbs.$elems.bubbleYInput().val("");
        bbs.$elems.setBubbleColorInput("blue");

        if (selectedBubbleIndex !== null && bubbles.length > selectedBubbleIndex)
            bubbles[selectedBubbleIndex].selected = false;
        selectedBubbleIndex = null;

        render();
    };
    mouseDown = function (e) {
        var i;

        lastMouseX = e.pageX-canvasOffset.left;
        lastMouseY = e.pageY-canvasOffset.top;

        for (i = bubbles.length-1; i >= 0; i--) {
            if (bubbles[i].value > Math.sqrt(Math.pow(lastMouseX - bubbles[i].x, 2) + Math.pow(lastMouseY - bubbles[i].y, 2))) {
                bubblePressed = true;
                selectedBubbleIndex = i;
                selectBubble();
                break;
            }
        }
    };
    mouseMove = function (e) {
        var bubble, showResizeCursor, offsetX, offsetY, distance,
            x = e.pageX - canvasOffset.left,
            y = e.pageY - canvasOffset.top;

        showResizeCursor = function (bubbleX, bubbleY) {
            if ((x <= bubbleX && y <= bubbleY) || (x >= bubbleX && y >= bubbleY)) {
                bbs.$elems.canvas().css("cursor", "nw-resize");
            }
            else {
                bbs.$elems.canvas().css("cursor", "sw-resize");
            }
        };

        if (selectedBubbleIndex !== null) {
            bubble = bubbles[selectedBubbleIndex];

            distance = Math.sqrt(Math.pow(x - bubble.x, 2) + Math.pow(y - bubble.y, 2));

            if (distance > bubble.value - 7 && distance < bubble.value + 7) {
                showResizeCursor(bubble.x, bubble.y);

                if (bubblePressed) {
                    bubble.value = Math.round(distance);
                    bbs.$elems.bubbleValueInput().val(bubble.value);
                }
            }
            else {

                if (distance < bubble.value-6) {
                    bbs.$elems.canvas().css("cursor", "move");
                }
                else {
                    bbs.$elems.canvas().css("cursor", "normal");
                }

                if (bubblePressed) {

                    offsetX = x - lastMouseX;
                    offsetY = y - lastMouseY;

                    bubbles[selectedBubbleIndex].x = bubbles[selectedBubbleIndex].x + offsetX;
                    bubbles[selectedBubbleIndex].y = bubbles[selectedBubbleIndex].y + offsetY;

                    bbs.$elems.bubbleXInput().val(bubbles[selectedBubbleIndex].x);
                    bbs.$elems.bubbleYInput().val(bubbles[selectedBubbleIndex].y);
                }
            }

            lastMouseX = x;
            lastMouseY = y;

            render();
        }
    };
    mouseUp = function () {
        bubblePressed = false;
    };
    changeInputValue = function () {
        if (selectedBubbleIndex === null) {
            return;
        }

        bubbles[selectedBubbleIndex].x = parseInt(bbs.$elems.bubbleXInput().val(), 10);
        bubbles[selectedBubbleIndex].y = parseInt(bbs.$elems.bubbleYInput().val(), 10);
        bubbles[selectedBubbleIndex].value = parseInt(bbs.$elems.bubbleValueInput().val(), 10);
        bubbles[selectedBubbleIndex].title = bbs.$elems.bubbleTitleInput().val();

        render();
    };
    colorChange = function (hexValue) {
          if (selectedBubbleIndex !== null) {
              bubbles[selectedBubbleIndex].color = hexValue;
              render();
          }
    };

    initModule = function (containerId) {
        bubbles = [];

        bbs.$elems.init(containerId);
        bbs.canvas.init();

        bbs.$elems.bubblesValues().change(render);
        bbs.$elems.bubblesTitles().change(render);

        bbs.$elems.canvas().mousedown(mouseDown);
        bbs.$elems.canvas().mousemove(mouseMove);
        bbs.$elems.canvas().mouseup(mouseUp);
        bbs.$elems.canvas().dblclick(addBubble);
        bbs.$elems.canvas().on('contextmenu', rightClick);
        canvasOffset = bbs.$elems.canvas().offset();

        bbs.$elems.bubbleXInput().keyup(changeInputValue);
        bbs.$elems.bubbleYInput().keyup(changeInputValue);
        bbs.$elems.bubbleValueInput().keyup(changeInputValue);
        bbs.$elems.bubbleTitleInput().keyup(changeInputValue);

        bbs.$elems.addColorChangeEventHandler(colorChange);
    };

    return {
        init: initModule
    };
}());