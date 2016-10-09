var isServer = typeof exports !== "undefined";
if (isServer) {
    var Eval = require("../build/wires-reactive-es5.js").Eval;
    var should = require("should");
} else {
    Eval = window.__npm__["wires-reactive"].Eval;
}


describe("Eval test", function() {
    it("Should evaluate an expression", function() {
        var context = {
            scope: {
                user: {
                    name: "Bob"
                }
            }
        }
        var result = Eval.expression(context, 'user.name.slice(2)');
        result.should.equal("b");
    });

    it("Should evaluate an expression with locals", function() {
        var context = {
            scope: {
                a: 10
            },
            locals: {
                a: 20
            }
        }
        var result = Eval.expression(context, 'a+1');
        result.should.equal(21);
    });

    it("Should assign a value", function() {
        var context = {
            scope: {
                a: 10
            }
        }
        var result = Eval.assign(context, "a", 100);
        context.scope.a.should.equal(100);
    });

    after(function() {

    });
})