var isServer = typeof exports !== "undefined";
if (isServer) {
    var Watch = require("../build/wires-reactive-es5.js").Watch;
    var should = require("should");
} else {
    Watch = window.__npm__["wires-reactive"].Watch;
}


describe("Watch expressions", function() {
    it("Should watch an expression", function(done) {
        var context = {
            scope: {
                user: {
                    name: "Bob"
                }
            }
        }
        var results = []
        Watch.expression(context, "{ active : user.name === 'Bob' }", function(result) {
            results.push(result);
        });
        setTimeout(function() {
            context.scope.user.name = "Dick";
        }, 1)


        setTimeout(function() {
            done();
            results.should.deepEqual([{ active: true }, { active: false }]);
        }, 30)

    });
    after(function() {

    });
})