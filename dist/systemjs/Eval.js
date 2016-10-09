System.register(["wires-angular-expressions"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var wires_angular_expressions_1;
    var Eval;
    return {
        setters:[
            function (wires_angular_expressions_1_1) {
                wires_angular_expressions_1 = wires_angular_expressions_1_1;
            }],
        execute: function() {
            Eval = class Eval {
                static assign(context, expression, value) {
                    let model = wires_angular_expressions_1.Compile(expression);
                    model.assign(context.scope, value);
                }
                static expression(context, expression) {
                    let model = wires_angular_expressions_1.Compile(expression);
                    return model(context.scope, context.locals);
                }
            };
            exports_1("Eval", Eval);
        }
    }
});
