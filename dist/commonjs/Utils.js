"use strict";
const extract_vars_1 = require("extract-vars");
exports.precompileString = (str) => {
    let re = /({{\s*[^}]+\s*}})/g;
    let list = str.split(re).map((x) => {
        let expr = x.match(/{{\s*([^}]+)\s*}}/);
        if (expr) {
            let expressionString = expr[1].trim();
            return [expressionString, extract_vars_1.dig(expressionString)];
        }
        return x;
    });
    let filtered = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i] !== undefined && list[i] !== "") {
            filtered.push(list[i]);
        }
    }
    return filtered;
};
exports.precompileExpression = (str) => {
    return [str, extract_vars_1.dig(str)];
};
exports.extractWatchables = (str) => {
    return extract_vars_1.dig(str);
};
