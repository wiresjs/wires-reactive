System.register(["./xPath", "./Utils", "wires-angular-expressions", "async-watch"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var xPath_1, Utils_1, wires_angular_expressions_1, async_watch_1;
    var Watch;
    return {
        setters:[
            function (xPath_1_1) {
                xPath_1 = xPath_1_1;
            },
            function (Utils_1_1) {
                Utils_1 = Utils_1_1;
            },
            function (wires_angular_expressions_1_1) {
                wires_angular_expressions_1 = wires_angular_expressions_1_1;
            },
            function (async_watch_1_1) {
                async_watch_1 = async_watch_1_1;
            }],
        execute: function() {
            Watch = class Watch {
                static evaluate(context, tpl) {
                    if (typeof tpl === "string") {
                        tpl = Utils_1.precompileString(tpl);
                    }
                    let str = [];
                    for (let i = 0; i < tpl.length; i++) {
                        let item = tpl[i];
                        if (typeof item === "object") {
                            let expression = item[0];
                            let model = wires_angular_expressions_1.Compile(expression);
                            str.push(model(context.scope, context.locals));
                        }
                        else {
                            str.push(item);
                        }
                    }
                    return str.join("");
                }
                static template(context, tpl, fn) {
                    if (typeof tpl === "string") {
                        tpl = Utils_1.precompileString(tpl);
                    }
                    let precompiled = tpl;
                    let watchables = [];
                    for (let i = 0; i < precompiled.length; i++) {
                        let item = precompiled[i];
                        if (typeof item === "object") {
                            let watchable = item[1];
                            for (let w = 0; w < watchable.length; w++) {
                                let variable = watchable[w];
                                if (watchables.indexOf(variable) === -1) {
                                    watchables.push(variable);
                                }
                            }
                        }
                    }
                    fn(this.evaluate(context, tpl));
                    if (watchables.length === 0) {
                        return {
                            unsubscribe: () => null,
                            destroy: () => null,
                        };
                    }
                    let initial = true;
                    let watchers = [];
                    for (let i = 0; i < watchables.length; i++) {
                        let vpath = watchables[i];
                        if (context.locals && xPath_1.XPath.hasProperty(context.locals, vpath)) {
                            watchers.push(async_watch_1.AsyncWatch(context.locals, vpath, () => null));
                        }
                        else {
                            watchers.push(async_watch_1.AsyncWatch(context.scope, vpath, (value) => null));
                        }
                    }
                    return async_watch_1.AsyncSubscribe(watchers, (ch) => {
                        if (initial === false) {
                            fn(this.evaluate(context, tpl));
                        }
                        initial = false;
                    });
                }
            };
            exports_1("Watch", Watch);
        }
    }
});
