var bbs = bbs || {};

/* $Elems Module
 * Creates and provides the DOM elements in public jQuery variables. */

bbs.$elems = (function () {
    'use strict';
    var initModule, createDiv, setBubbleColorInput,
        container, options, canvas, bar,
        canvasId = "bubbles-canvas",
        barId = "bubble-bar",
        titleFieldId = "bubble-title-field",
        valueFieldId = "bubble-value-field",
        showTitlesCBId = "bubbles-titles",
        showValuesCBId = "bubbles-values",
        xFieldId = "bubble-x-coordinate",
        yFieldId = "bubble-y-coordinate",
        shapeSelectId = "bubble-shape-select",
        colorSampleId = "bubble-color-sample",
        colorChangeEventHandlers = [], addColorChangeEventHandler, colorChangeEvent;

    // helper functions
    createDiv = function (container, containerAttributes, id, content) {
        container.append('<div id="' + id + '" ' + containerAttributes + '>' + content + '</div>');
    };
    setBubbleColorInput = function (color) {
        $("#" + colorSampleId + " input").val(color);
        $("#" + colorSampleId).css("background-color", color);
    };
    colorChangeEvent = function () {
        var i, hexValue = $("#" + colorSampleId + " input").val();

        for (i = 0; i < colorChangeEventHandlers.length; i++) {
            colorChangeEventHandlers[i](hexValue);
        }
    };
    addColorChangeEventHandler = function (handler) {
        colorChangeEventHandlers.push(handler);
    };

    initModule = function (containerId) {
        var containerWidth, canvasHeight;

        container = $("#" + containerId);

        containerWidth = container.width();
        canvasHeight  = window.innerHeight - 30;

        container.hide();
        container.empty();

        createDiv(container, '', 'bubble-usage',
            '<h2>Usage</h2>' +
            '<ul>' +
                '<li><strong>Double click:</strong> create</li>' +
                '<li><strong>Click:</strong> select</li>' +
                '<li><strong>Right click:</strong> deselect</li>' +
                '<li><strong>Press mouse and move:</strong> move or resize the selected bubble (depending on the position of the mouse)</li>' +
            '</ul>'
        );
        createDiv(container, '', 'bubble-canvas-container',
             '<canvas id="' + canvasId + '" width="' + containerWidth + '"  height="' + canvasHeight + 'px">' +
             '</canvas>');
        createDiv(container, '', barId,
            '<label for="' + showTitlesCBId + '">Show titles </label>' +
            '<input type="checkbox" id="' + showTitlesCBId + '" checked="checked" />' +
            '<label for="' + showValuesCBId + '">Show values </label>' +
            '<input type="checkbox" id="' + showValuesCBId + '" checked="checked" />' +
            '<label for="' + titleFieldId + '">Title: </label>' +
            '<input type="text" id="' + titleFieldId + '" placeholder="Add title here" value="Bubble Title"/>' +
            '<label for="' + valueFieldId + '">Value: </label>' +
            '<input type="text" id="' + valueFieldId + '" placeholder="Add value here" value="50"/>' +
            '<label for="' + xFieldId + '">X: </label>' +
            '<input type="text" id="' + xFieldId + '" placeholder="X" size="3"/>' +
            '<label for="' + yFieldId + '">Y: </label>' +
            '<input type="text" id="' + yFieldId + '" placeholder="Y" size="3"/>' +
            '<label for="' + shapeSelectId + '">Shape: </label>' +
            '<select "text" id="' + shapeSelectId + '">' +
            '   <option>Circle</option>' + 
            '   <option>Rectangle</option>' + 
            '   <option>Triangle</option>' + 
            '</select>' + 
            '<label for="' + colorSampleId + '">Color: </label>' +
            '<div id="' + colorSampleId + '">' +
                '<input type="hidden" value="#00f"/>' +
            '</div>'
        );
        createDiv(container, '', 'bubble-usage-mark',
            '?'
        );

        canvas = container.find("#" + canvasId);

        $("#" + colorSampleId).ColorPicker({
            color: '#00f',
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            },
            onHide: function (colpkr) {
                $(colpkr).fadeOut(500);
                return false;
            },
            onSubmit: function (hsb, hex, rgb, el) {
                $(el).css('backgroundColor', '#' + hex);
                $(el).find("input").val("#" + hex);
                $(el).ColorPickerHide();
                colorChangeEvent();
            }
        });

        $("#bubble-usage-mark").hover(function () {
            $("#bubble-usage").show();
        }, function () {
            $("#bubble-usage").hide();
        })

        container.show();
    };

    return {
        init: initModule,
        bubblesTitles: function () { return $("#" + showTitlesCBId); },
        bubblesValues: function () { return $("#" + showValuesCBId); },
        bubbleTitleInput: function () { return $("#" + titleFieldId); },
        bubbleValueInput: function () { return $("#" + valueFieldId); },
        bubbleXInput: function () { return $("#" + xFieldId); },
        bubbleYInput: function () { return $("#" + yFieldId); },
        shapeSelect: function () { return $("#" + shapeSelectId); },
        bubbleColorInput: function () { return $("#" + colorSampleId + " input"); },
        addColorChangeEventHandler: addColorChangeEventHandler,
        setBubbleColorInput: setBubbleColorInput,
        options: function () { return options; },
        canvas: function () { return canvas; }
    };
}());