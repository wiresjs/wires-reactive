"use strict";
var wires_angular_expressions_1 = require("wires-angular-expressions");
var Eval = (function () {
    function Eval() {
    }
    Eval.assign = function (context, expression, value) {
        var model = wires_angular_expressions_1.Compile(expression);
        model.assign(context.scope, value);
    };
    Eval.expression = function (context, expression) {
        var model = wires_angular_expressions_1.Compile(expression);
        return model(context.scope, context.locals);
    };
    return Eval;
}());
exports.Eval = Eval;
