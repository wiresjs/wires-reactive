(function($__exports__, $isBackend) {var __local__ = {};var define = function(n, d, f) {__local__[n] = { d: d, f: f }};var __resolve__ = function(name) {var m = __local__[name];if (m === undefined) {if ($isBackend) {return require(name);} else {$__exports__.__npm__ = $__exports__.__npm__ || {};return $__exports__.__npm__[name];}}if (m.r) { return m.r; }m.r = {};var z = [__resolve__, m.r];for (var i = 2; i < m.d.length; i++) {z.push(__resolve__(m.d[i]));}m.f.apply(null, z);return m.r;};
define("Utils", ["require", "exports", "extract-vars"], function (require, exports, extract_vars_1) {
    "use strict";
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
});
define("XPath", ["require", "exports"], function (require, exports) {
    "use strict";
    class XPath {
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
    }
    exports.XPath = XPath;
});
define("Watch", ["require", "exports", "XPath", "Utils", "wires-angular-expressions", "async-watch"], function (require, exports, xPath_1, Utils_1, wires_angular_expressions_1, async_watch_1) {
    "use strict";
    class Watch {
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
    }
    exports.Watch = Watch;
});
define("index", ["require", "exports", "Watch"], function (require, exports, Watch_1) {
    "use strict";
    exports.Watch = Watch_1.Watch;
});

var __expose__ = function(n, m, w, c) {
    var cs = c ? c.split(",") : [];
    if (cs.length) { for (var ln in __local__) { for (var i = 0; i < cs.length; i++) { if (ln.indexOf(cs[i]) === 0) { __resolve__(ln) } } } }
    var e = __resolve__(n);
    var bc;
    if (!$isBackend) { var npm = $__exports__.__npm__ = $__exports__.__npm__ || {}; if (m) { bc = npm[m] = {} } }
    for (var k in e) {
        $isBackend || w ? $__exports__[k] = e[k] : null;
        bc ? bc[k] = e[k] : null;
    }

};
__expose__("index", "wires-watch", false, "");
})(typeof module !== "undefined" && module.exports && typeof process === "object" ?
    exports : typeof window !== "undefined" ? window : this,
    typeof module !== "undefined" && module.exports && typeof process === "object");