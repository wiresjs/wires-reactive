"use strict";
const wires_angular_expressions_1 = require("wires-angular-expressions");
class Eval {
    static assign(context, expression, value) {
        let model = wires_angular_expressions_1.Compile(expression);
        model.assign(context.scope, value);
    }
    static expression(context, expression) {
        let model = wires_angular_expressions_1.Compile(expression);
        return model(context.scope, context.locals);
    }
}
exports.Eval = Eval;
