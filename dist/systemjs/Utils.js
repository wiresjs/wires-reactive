System.register(["extract-vars"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var extract_vars_1;
    var precompileString;
    return {
        setters:[
            function (extract_vars_1_1) {
                extract_vars_1 = extract_vars_1_1;
            }],
        execute: function() {
            exports_1("precompileString", precompileString = (str) => {
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
            });
        }
    }
});
