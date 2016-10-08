System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var XPath;
    return {
        setters:[],
        execute: function() {
            XPath = class XPath {
                static dotNotation(path) {
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
                }
                static hasProperty(obj, path) {
                    if (path && path.length === 0 || obj === undefined) {
                        return false;
                    }
                    let notation = this.dotNotation(path);
                    if (!notation) {
                        return false;
                    }
                    path = notation.path;
                    let validNext = true;
                    for (let i = 0; i < path.length; i++) {
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
                }
                static get(obj, path) {
                    if (path.length === 0 || obj === undefined) {
                        return undefined;
                    }
                    let notation = this.dotNotation(path);
                    if (!notation) {
                        return;
                    }
                    path = notation.path;
                    for (let i = 0; i < path.length; i++) {
                        obj = obj[path[i]];
                        if (obj === undefined) {
                            return undefined;
                        }
                    }
                    return obj;
                }
            };
            exports_1("XPath", XPath);
        }
    }
});
