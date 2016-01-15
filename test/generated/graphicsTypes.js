var Module = require("../../src/transpiled.js");
var addManualSymbols = require("../../src/symbols-manual.js").addManualSymbols;
var addGeneratedSymbols = require("../../src/symbols-generated.js").addGeneratedSymbols;
var expect = require('chai').expect;

function instance() {
    var rocky = {module: Module()};
    addManualSymbols(rocky);
    addGeneratedSymbols(rocky);
    return rocky;
}

describe('Module', function() {
    it("exists", function() {
        expect(Module).to.not.be.an('undefined');
    });

    it ("can create instances", function() {
        expect(instance()).to.not.be.an('undefined');
    });

    it("grants access to functions", function() {
        expect(instance().grect_standardize).to.be.a('function');
    });
});

describe('Graphic Types', function() {
    var rocky = instance();
    var GRect = rocky.GRect;
    describe('grect_standardize', function() {
        var grect_standardize = rocky.grect_standardize;
        it("changes a rect", function() {
            var rect = GRect(10, 10, -5, 15);
            grect_standardize(rect);
            expect(rect).to.eql({x:5, y:10, w:5, h:15});
        });
    });
    describe('grect_clip', function() {
        var grect_clip = rocky.grect_clip;
        it("changes a rect", function() {
            var rect = GRect(10, 10, 10, 10);
            grect_clip(rect, [15, 15, 10, 10]);
            expect(rect).to.eql({x:15, y:15, w:5, h:5});
        });
    });
});
