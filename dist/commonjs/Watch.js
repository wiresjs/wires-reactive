"use strict";
var Eval_1 = require("./Eval");
var XPath_1 = require("./XPath");
var Utils_1 = require("./Utils");
var wires_angular_expressions_1 = require("wires-angular-expressions");
var async_watch_1 = require("async-watch");
var Watch = (function () {
    function Watch() {
    }
    Watch.evalTemplate = function (context, tpl) {
        if (typeof tpl === "string") {
            tpl = Utils_1.precompileString(tpl);
        }
        var str = [];
        for (var i = 0; i < tpl.length; i++) {
            var item = tpl[i];
            if (typeof item === "object") {
                var expression = item[0];
                var model = wires_angular_expressions_1.Compile(expression);
                str.push(model(context.scope, context.locals));
            }
            else {
                str.push(item);
            }
        }
        return str.join("");
    };
    Watch.expression = function (context, expression, fn) {
        if (typeof expression === "string") {
            expression = Utils_1.precompileExpression(expression);
        }
        var watchables = expression[1];
        var template = expression[0];
        fn(Eval_1.Eval.expression(context, template));
        if (watchables.length === 0) {
            return;
        }
        var watchers = [];
        var initial = true;
        for (var i = 0; i < watchables.length; i++) {
            var vpath = watchables[i];
            if (context.locals && XPath_1.XPath.hasProperty(context.locals, vpath)) {
                watchers.push(async_watch_1.AsyncWatch(context.locals, vpath, function () { return null; }));
            }
            else {
                watchers.push(async_watch_1.AsyncWatch(context.scope, vpath, function (value) { return null; }));
            }
        }
        return async_watch_1.AsyncSubscribe(watchers, function (ch) {
            if (initial === false) {
                fn(Eval_1.Eval.expression(context, template));
            }
            initial = false;
        });
    };
    Watch.template = function (context, tpl, fn) {
        var _this = this;
        if (typeof tpl === "string") {
            tpl = Utils_1.precompileString(tpl);
        }
        var precompiled = tpl;
        var watchables = [];
        for (var i = 0; i < precompiled.length; i++) {
            var item = precompiled[i];
            if (typeof item === "object") {
                var watchable = item[1];
                for (var w = 0; w < watchable.length; w++) {
                    var variable = watchable[w];
                    if (watchables.indexOf(variable) === -1) {
                        watchables.push(variable);
                    }
                }
            }
        }
        fn(this.evalTemplate(context, tpl));
        if (watchables.length === 0) {
            return;
        }
        var initial = true;
        var watchers = [];
        for (var i = 0; i < watchables.length; i++) {
            var vpath = watchables[i];
            if (context.locals && XPath_1.XPath.hasProperty(context.locals, vpath)) {
                watchers.push(async_watch_1.AsyncWatch(context.locals, vpath, function () { return null; }));
            }
            else {
                watchers.push(async_watch_1.AsyncWatch(context.scope, vpath, function (value) { return null; }));
            }
        }
        return async_watch_1.AsyncSubscribe(watchers, function (ch) {
            if (initial === false) {
                fn(_this.evalTemplate(context, tpl));
            }
            initial = false;
        });
    };
    return Watch;
}());
exports.Watch = Watch;
