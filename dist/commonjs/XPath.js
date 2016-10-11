"use strict";
var XPath = (function () {
    function XPath() {
    }
    XPath.dotNotation = function (path) {
        if (path instanceof Array) {
            return {
                path: path,
                str: path.join("."),
            };
        }
        if (typeof path !== "string") {
            return;
        }
        return {
            path: path.split("\."),
            str: path,
        };
    };
    XPath.hasProperty = function (obj, path) {
        if (path && path.length === 0 || obj === undefined) {
            return false;
        }
        var notation = this.dotNotation(path);
        if (!notation) {
            return false;
        }
        path = notation.path;
        var validNext = true;
        for (var i = 0; i < path.length; i++) {
            if (validNext && obj.hasOwnProperty(path[i])) {
                obj = obj[path[i]];
                if (obj === undefined) {
                    validNext = false;
                }
            }
            else {
                return false;
            }
        }
        return true;
    };
    XPath.get = function (obj, path) {
        if (path.length === 0 || obj === undefined) {
            return undefined;
        }
        var notation = this.dotNotation(path);
        if (!notation) {
            return;
        }
        path = notation.path;
        for (var i = 0; i < path.length; i++) {
            obj = obj[path[i]];
            if (obj === undefined) {
                return undefined;
            }
        }
        return obj;
    };
    return XPath;
}());
exports.XPath = XPath;
