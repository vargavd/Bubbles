var bbs = bbs || {};

/* Utils Module
 * Helper functions. */

 bbs.utils = (function () {
    'use strict';
    var  forEach;

    forEach = function (object, processProperty) {
        var propertyName;

        for (propertyName in object) {
            if (object.hasOwnProperty(propertyName)) {
                processProperty(object[propertyName], propertyName);
            }
        }
    };

    return {
        forEach: forEach
    };
}());