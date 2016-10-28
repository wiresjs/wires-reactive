"use strict";
var XPath_1 = require("./XPath");
var wires_angular_expressions_1 = require("wires-angular-expressions");
var extract_vars_1 = require("extract-vars");
var exprCache = {};
var Eval = (function () {
    function Eval() {
    }
    Eval.assign = function (context, expression, value) {
        var cached = exprCache[expression];
        var variables = [];
        if (cached) {
            variables = cached;
        }
        else {
            variables = extract_vars_1.dig(expression);
            exprCache[expression] = variables;
        }
        var targetVariable = variables[0];
        if (targetVariable) {
            if (context.locals) {
                if (XPath_1.XPath.get(context.locals, targetVariable)) {
                    XPath_1.XPath.set(context.locals, targetVariable, value);
                }
            }
            else {
                XPath_1.XPath.set(context.scope, targetVariable, value);
            }
        }
    };
    Eval.expression = function (context, expression) {
        var model = wires_angular_expressions_1.Compile(expression);
        return model(context.scope, context.locals);
    };
    return Eval;
}());
exports.Eval = Eval;
