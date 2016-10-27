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
    XPath.set = function (obj, xpath, v) {
        var path = xpath.split("\.");
        if (path.length === 1) {
            obj[xpath] = v;
        }
        if (path.length >= 2) {
            var initialArray = obj[path[0]];
            var value = initialArray;
            if (value === undefined) {
                value = {};
                obj[path[0]] = value;
            }
            for (var i = 1; i < path.length; i++) {
                var x = path[i];
                if (i === path.length - 1) {
                    value[x] = v;
                }
                else {
                    if (value[x] === undefined) {
                        var nvalue = {};
                        value[x] = nvalue;
                        value = nvalue;
                    }
                    else {
                        value = value[x];
                    }
                }
            }
        }
    };
    return XPath;
}());
exports.XPath = XPath;
