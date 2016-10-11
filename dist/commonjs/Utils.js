"use strict";
var extract_vars_1 = require("extract-vars");
exports.precompileString = function (str) {
    var re = /({{\s*[^}]+\s*}})/g;
    var list = str.split(re).map(function (x) {
        var expr = x.match(/{{\s*([^}]+)\s*}}/);
        if (expr) {
            var expressionString = expr[1].trim();
            return [expressionString, extract_vars_1.dig(expressionString)];
        }
        return x;
    });
    var filtered = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i] !== undefined && list[i] !== "") {
            filtered.push(list[i]);
        }
    }
    return filtered;
};
exports.precompileExpression = function (str) {
    return [str, extract_vars_1.dig(str)];
};
exports.extractWatchables = function (str) {
    return extract_vars_1.dig(str);
};
