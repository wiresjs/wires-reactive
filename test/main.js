var isServer = typeof exports !== "undefined";
if (isServer) {
    var Watch = require("../build/wires-watch-es5.js").Watch;
    var should = require("should");
} else {
    Watch = window.__npm__["wires-watch"].Watch;
}


describe("Should do something", function() {
    it("Should say hello", function() {

    });

    after(function() {

    });
})