System.register(["./XPath", "./Eval", "./Watch", "./Utils"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters:[
            function (XPath_1_1) {
                exports_1({
                    "XPath": XPath_1_1["XPath"]
                });
            },
            function (Eval_1_1) {
                exports_1({
                    "Eval": Eval_1_1["Eval"]
                });
            },
            function (Watch_1_1) {
                exports_1({
                    "Watch": Watch_1_1["Watch"]
                });
            },
            function (Utils_1_1) {
                exports_1({
                    "precompileString": Utils_1_1["precompileString"],
                    "precompileExpression": Utils_1_1["precompileExpression"],
                    "extractWatchables": Utils_1_1["extractWatchables"]
                });
            }],
        execute: function() {
        }
    }
});
