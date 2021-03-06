/**
 * Created by VvD on 2014.03.23..
 */

/* Bubbles - A fun bubble diagram. */

var bbs = (function () {
    'use strict';
    var initModule, shapes, bubbleId = 0, canvasOffset, render,
        addBubble, rightClick, selectBubble, deselectBubble, changeInputValue, colorChange,
        mouseDown, mouseUp, mouseMove,
        showTitles, showValues,
        bubblePressed = false, selectedBubbleIndex = null, lastMouseX, lastMouseY;

    render = function () {
        bbs.canvas.render(shapes, showTitles(), showValues());
    };
    showTitles = function () {
        return bbs.$elems.bubblesTitles().is(":checked");
    };
    showValues = function () {
        return bbs.$elems.bubblesValues().is(":checked");
    };
    addBubble = function (e) {
        if (selectedBubbleIndex !== null) {
            shapes[selectedBubbleIndex].selected = false;
        }

        selectedBubbleIndex = shapes.length;
        
        switch (bbs.$elems.shapeSelect().val()) {
            case "Square":
                shapes.push(bbs.shapes.getSquare({
                    x: e.pageX - canvasOffset.left,
                    y: e.pageY - canvasOffset.top,
                    value: parseInt(bbs.$elems.bubbleValueInput().val(), 10),
                    color: bbs.$elems.bubbleColorInput().val(),
                    title: bbs.$elems.bubbleTitleInput().val(),
                    id:  ++bubbleId,
                    selected: true
                }));
                break;
            case "Triangle":
                shapes.push(bbs.shapes.getTriangle({
                    x: e.pageX - canvasOffset.left,
                    y: e.pageY - canvasOffset.top,
                    value: parseInt(bbs.$elems.bubbleValueInput().val(), 10),
                    color: bbs.$elems.bubbleColorInput().val(),
                    title: bbs.$elems.bubbleTitleInput().val(),
                    id:  ++bubbleId,
                    selected: true
                }));
                break;
            default:
                shapes.push(bbs.shapes.getCircle({
                    x: e.pageX - canvasOffset.left,
                    y: e.pageY - canvasOffset.top,
                    value: parseInt(bbs.$elems.bubbleValueInput().val(), 10),
                    color: bbs.$elems.bubbleColorInput().val(),
                    title: bbs.$elems.bubbleTitleInput().val(),
                    id:  ++bubbleId,
                    selected: true
                }));
        };

        render();
    };
    rightClick = function (e) {
        var i,
            mouseX = e.pageX-canvasOffset.left,
            mouseY = e.pageY-canvasOffset.top;

        e.preventDefault();

        for (i = shapes.length-1; i >= 0; i--) {
            if (shapes[i].value > Math.sqrt(Math.pow(mouseX - shapes[i].x, 2) + Math.pow(mouseY - shapes[i].y, 2))) {
                shapes.splice(i, 1);
                break;
            }
        }

        deselectBubble();
        render();
    };
    selectBubble = function () {
        var i, bubble;

        for (i = selectedBubbleIndex; i < shapes.length - 1; i++) {
            bubble = shapes[i+1];
            shapes[i+1] = shapes[i];
            shapes[i] = bubble;
        }

        selectedBubbleIndex = shapes.length - 1;
        bubble = shapes[selectedBubbleIndex];

        bbs.$elems.bubbleTitleInput().val(bubble.title);
        bbs.$elems.bubbleValueInput().val(bubble.value);
        bbs.$elems.bubbleXInput().val(bubble.x);
        bbs.$elems.bubbleYInput().val(bubble.y);
        bbs.$elems.setBubbleColorInput(bubble.color);

        for (i = 0; i < shapes.length - 1; i++) {
            shapes[i].selected = false;
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

        if (selectedBubbleIndex !== null && shapes.length > selectedBubbleIndex)
            shapes[selectedBubbleIndex].selected = false;
        selectedBubbleIndex = null;

        render();
    };
    mouseDown = function (e) {
        var i;

        lastMouseX = e.pageX-canvasOffset.left;
        lastMouseY = e.pageY-canvasOffset.top;

        for (i = shapes.length-1; i >= 0; i--) {
            if (shapes[i].isItHover(shapes[i].x, shapes[i].y, shapes[i].value, lastMouseX, lastMouseY)) {
                bubblePressed = true;
                selectedBubbleIndex = i;
                selectBubble();
                break;
            }
        }
    };
    mouseMove = function (e) {
        var shape, showResizeCursor, offsetX, offsetY,
            x = e.pageX - canvasOffset.left,
            y = e.pageY - canvasOffset.top;

        showResizeCursor = function (bubbleX, bubbleY) {
            if (x - 5 <= bubbleX && x + 5 > bubbleX) {
                bbs.$elems.canvas().css("cursor", "n-resize");
            }
            else if (y - 5 <= bubbleY && y + 5 > bubbleY) {
                bbs.$elems.canvas().css("cursor", "w-resize");
            }
            else if ((x < bubbleX && y < bubbleY) || (x > bubbleX && y > bubbleY)) {
                bbs.$elems.canvas().css("cursor", "nw-resize");
            }
            else {
                bbs.$elems.canvas().css("cursor", "sw-resize");
            }
        };

        if (selectedBubbleIndex !== null) {
            shape = shapes[selectedBubbleIndex];
            
            if (shape.isItOnTheEdge(shape.x, shape.y, shape.value, x, y)) {
                showResizeCursor(shape.x, shape.y);

                if (bubblePressed) {
                    bbs.$elems.bubbleValueInput().val(shape.setRadius(shape.x, shape.y, x, y));
                }
            }
            else {

                if (shape.isItHover(shape.x, shape.y, shape.value, x, y)) {
                    bbs.$elems.canvas().css("cursor", "move");
                }
                else {
                    bbs.$elems.canvas().css("cursor", "normal");
                }

                if (bubblePressed) {

                    offsetX = x - lastMouseX;
                    offsetY = y - lastMouseY;

                    shapes[selectedBubbleIndex].x = shapes[selectedBubbleIndex].x + offsetX;
                    shapes[selectedBubbleIndex].y = shapes[selectedBubbleIndex].y + offsetY;

                    bbs.$elems.bubbleXInput().val(shapes[selectedBubbleIndex].x);
                    bbs.$elems.bubbleYInput().val(shapes[selectedBubbleIndex].y);
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

        shapes[selectedBubbleIndex].x = parseInt(bbs.$elems.bubbleXInput().val(), 10);
        shapes[selectedBubbleIndex].y = parseInt(bbs.$elems.bubbleYInput().val(), 10);
        shapes[selectedBubbleIndex].value = parseInt(bbs.$elems.bubbleValueInput().val(), 10);
        shapes[selectedBubbleIndex].title = bbs.$elems.bubbleTitleInput().val();

        render();
    };
    colorChange = function (hexValue) {
          if (selectedBubbleIndex !== null) {
              shapes[selectedBubbleIndex].color = hexValue;
              render();
          }
    };

    initModule = function (containerId) {
        shapes = [];

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