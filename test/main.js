var isServer = typeof exports !== "undefined";
if (isServer) {
    var Watch = require("../build/commonjs/index.js").Watch;
    var should = require("should");
} else {
    var Watch = WiresReactive.Watch;
}


describe("Should do something", function() {
    it("Should watch a simple string", function(done) {
        var context = {
            scope: {
                user: {
                    name: "Bob"
                }
            }
        }
        Watch.template(context, "Hello {{user.name}}! We love you {{user.name}}", function(str) {
            str.should.equal("Hello Bob! We love you Bob");
            done();
        });
    });

    it("Should trigger twice", function(done) {
        var context = {
            scope: {
                user: {
                    name: "Bob"
                }
            }
        }
        var time = new Date().getTime()
        var results = [];

        Watch.template(context, "Hello {{user.name}}", function(str) {
            results.push(str);
        });
        setTimeout(function() {
            context.scope.user.name = "Dick";
        }, 10)



        setTimeout(function() {
            results.should.deepEqual(['Hello Bob', 'Hello Dick'])
            done();
        }, 25)
    });

    it("Should be triggered instantly", function() {
        var context = {
            scope: {
                user: {
                    name: "Bob"
                }
            }
        }
        var results = [];
        var index = 0;
        Watch.template(context, "Hello {{user.name}}", function(str) {
            index.should.equal(0)
            str.should.equal("Hello Bob");
        });
        index++;
    });

    after(function() {

    });
})