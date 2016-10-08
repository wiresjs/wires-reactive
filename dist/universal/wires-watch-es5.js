"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($__exports__, $isBackend) {
    var __local__ = {};var define = function define(n, d, f) {
        __local__[n] = { d: d, f: f };
    };var __resolve__ = function __resolve__(name) {
        var m = __local__[name];if (m === undefined) {
            if ($isBackend) {
                return require(name);
            } else {
                $__exports__.__npm__ = $__exports__.__npm__ || {};return $__exports__.__npm__[name];
            }
        }if (m.r) {
            return m.r;
        }m.r = {};var z = [__resolve__, m.r];for (var i = 2; i < m.d.length; i++) {
            z.push(__resolve__(m.d[i]));
        }m.f.apply(null, z);return m.r;
    };
    define("Utils", ["require", "exports", "extract-vars"], function (require, exports, extract_vars_1) {
        "use strict";

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
    });
    define("XPath", ["require", "exports"], function (require, exports) {
        "use strict";

        var XPath = function () {
            function XPath() {
                _classCallCheck(this, XPath);
            }

            _createClass(XPath, null, [{
                key: "dotNotation",
                value: function dotNotation(path) {
                    if (path instanceof Array) {
                        return {
                            path: path,
                            str: path.join(".")
                        };
                    }
                    if (typeof path !== "string") {
                        return;
                    }
                    return {
                        path: path.split("\."),
                        str: path
                    };
                }
            }, {
                key: "hasProperty",
                value: function hasProperty(obj, path) {
                    if (path && path.length === 0 || obj === undefined) {
                        return false;
                    }
                    var notation = this.dotNotation(path);
                    if (!notation) {
                        return false;
                    }
                    path = notation.path;
                    var validNext = true;
                    for (var i = 0; i < path.length; i++) {
                        if (validNext && obj.hasOwnProperty(path[i])) {
                            obj = obj[path[i]];
                            if (obj === undefined) {
                                validNext = false;
                            }
                        } else {
                            return false;
                        }
                    }
                    return true;
                }
            }, {
                key: "get",
                value: function get(obj, path) {
                    if (path.length === 0 || obj === undefined) {
                        return undefined;
                    }
                    var notation = this.dotNotation(path);
                    if (!notation) {
                        return;
                    }
                    path = notation.path;
                    for (var i = 0; i < path.length; i++) {
                        obj = obj[path[i]];
                        if (obj === undefined) {
                            return undefined;
                        }
                    }
                    return obj;
                }
            }]);

            return XPath;
        }();

        exports.XPath = XPath;
    });
    define("Watch", ["require", "exports", "XPath", "Utils", "wires-angular-expressions", "async-watch"], function (require, exports, xPath_1, Utils_1, wires_angular_expressions_1, async_watch_1) {
        "use strict";

        var Watch = function () {
            function Watch() {
                _classCallCheck(this, Watch);
            }

            _createClass(Watch, null, [{
                key: "evaluate",
                value: function evaluate(context, tpl) {
                    if (typeof tpl === "string") {
                        tpl = Utils_1.precompileString(tpl);
                    }
                    var str = [];
                    for (var i = 0; i < tpl.length; i++) {
                        var item = tpl[i];
                        if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
                            var expression = item[0];
                            var model = wires_angular_expressions_1.Compile(expression);
                            str.push(model(context.scope, context.locals));
                        } else {
                            str.push(item);
                        }
                    }
                    return str.join("");
                }
            }, {
                key: "template",
                value: function template(context, tpl, fn) {
                    var _this = this;

                    if (typeof tpl === "string") {
                        tpl = Utils_1.precompileString(tpl);
                    }
                    var precompiled = tpl;
                    var watchables = [];
                    for (var i = 0; i < precompiled.length; i++) {
                        var item = precompiled[i];
                        if ((typeof item === "undefined" ? "undefined" : _typeof(item)) === "object") {
                            var watchable = item[1];
                            for (var w = 0; w < watchable.length; w++) {
                                var variable = watchable[w];
                                if (watchables.indexOf(variable) === -1) {
                                    watchables.push(variable);
                                }
                            }
                        }
                    }
                    fn(this.evaluate(context, tpl));
                    if (watchables.length === 0) {
                        return {
                            unsubscribe: function unsubscribe() {
                                return null;
                            },
                            destroy: function destroy() {
                                return null;
                            }
                        };
                    }
                    var initial = true;
                    var watchers = [];
                    for (var _i = 0; _i < watchables.length; _i++) {
                        var vpath = watchables[_i];
                        if (context.locals && xPath_1.XPath.hasProperty(context.locals, vpath)) {
                            watchers.push(async_watch_1.AsyncWatch(context.locals, vpath, function () {
                                return null;
                            }));
                        } else {
                            watchers.push(async_watch_1.AsyncWatch(context.scope, vpath, function (value) {
                                return null;
                            }));
                        }
                    }
                    return async_watch_1.AsyncSubscribe(watchers, function (ch) {
                        if (initial === false) {
                            fn(_this.evaluate(context, tpl));
                        }
                        initial = false;
                    });
                }
            }]);

            return Watch;
        }();

        exports.Watch = Watch;
    });
    define("index", ["require", "exports", "Watch"], function (require, exports, Watch_1) {
        "use strict";

        exports.Watch = Watch_1.Watch;
    });

    var __expose__ = function __expose__(n, m, w, c) {
        var cs = c ? c.split(",") : [];
        if (cs.length) {
            for (var ln in __local__) {
                for (var i = 0; i < cs.length; i++) {
                    if (ln.indexOf(cs[i]) === 0) {
                        __resolve__(ln);
                    }
                }
            }
        }
        var e = __resolve__(n);
        var bc;
        if (!$isBackend) {
            var npm = $__exports__.__npm__ = $__exports__.__npm__ || {};if (m) {
                bc = npm[m] = {};
            }
        }
        for (var k in e) {
            $isBackend || w ? $__exports__[k] = e[k] : null;
            bc ? bc[k] = e[k] : null;
        }
    };
    __expose__("index", "wires-watch", false, "");
})(typeof module !== "undefined" && module.exports && (typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" ? exports : typeof window !== "undefined" ? window : undefined, typeof module !== "undefined" && module.exports && (typeof process === "undefined" ? "undefined" : _typeof(process)) === "object");