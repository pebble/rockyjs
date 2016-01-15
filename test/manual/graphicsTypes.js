var symbols = require("../../src/symbols-manual.js").symbols;
var expect = require('chai').expect;

describe('Graphic Types', function() {
    describe('DEG_TO_TRIGANGLE', function() {
        var DEG_TO_TRIGANGLE = symbols.DEG_TO_TRIGANGLE;
        it('works with simple values', function(){
            expect(DEG_TO_TRIGANGLE(0)).to.equal(0);
            expect(DEG_TO_TRIGANGLE(270)).to.equal(Math.PI * 3 / 2);
            expect(DEG_TO_TRIGANGLE(-45)).to.equal(-Math.PI / 4);
       });
    });

    describe('GPoint', function () {
        var GPoint = symbols.GPoint;
        describe('array', function() {
            it('works with arrays', function () {
                expect(GPoint([1, 2])).to.eql({x:1, y:2});
            });
            it('ignores everything beyond two elements', function() {
                expect(GPoint([1, 2, 3])).to.eql({x:1, y:2});
            });
            it('treats too short arrays as undefined values', function() {
                expect(GPoint([1])).to.eql({x:1, y:undefined});
                expect(GPoint([])).to.eql({x:undefined, y:undefined});
            });
        });
        describe('object', function() {
            it('works with object', function () {
                expect(GPoint({x:1, y:2})).to.eql({x:1, y:2});
            });
            it('ignores everything beyond x,y', function() {
                expect(GPoint({x:1, y:2, z:3})).to.eql({x:1, y:2});
            });
            it('treats missing properties as undefined', function() {
                expect(GPoint({x:1})).to.eql({x:1, y:undefined});
                expect(GPoint({y:2})).to.eql({x:undefined, y:2});
                expect(GPoint({z:3})).to.eql({x:undefined, y:undefined});
                expect(GPoint([])).to.eql({x:undefined, y:undefined});
            });
        });
        describe('values', function() {
            it('works with values', function () {
                expect(GPoint(1, 2)).to.eql({x:1, y:2});
            });
            it('ignores everything beyond two values', function() {
                expect(GPoint(1, 2, 3)).to.eql({x:1, y:2});
            });
            it('treats missing values as undefined', function() {
                expect(GPoint(1)).to.eql({x:1, y:undefined});
            });
        });
    });

    describe('GRect', function () {
        var GRect = symbols.GRect;
        describe('array', function() {
            it('works with arrays', function () {
                expect(GRect([1, 2, 3, 4])).to.eql({x:1, y:2, w:3, h:4});
            });
            it('ignores everything beyond four elements', function() {
                expect(GRect([1, 2, 3, 4, 5])).to.eql({x:1, y:2, w:3, h:4});
            });
            it('treats too short arrays as undefined values', function() {
                expect(GRect([1, 2, 3])).to.eql({x:1, y:2, w:3, h:undefined});
                expect(GRect([1, 2])).to.eql({x:1, y:2, w:undefined, h:undefined});
                expect(GRect([1])).to.eql({x:1, y:undefined, w:undefined, h:undefined});
                expect(GRect([])).to.eql({x:undefined, y:undefined, w:undefined, h:undefined});
            });
        });
        describe('object', function() {
            it('works with object', function () {
                expect(GRect({x:1, y:2, w:3, h:4})).to.eql({x:1, y:2, w:3, h:4});
            });
            it('ignores everything beyond x,y,w,h', function() {
                expect(GRect({x:1, y:2, w:3, h:4, z:5})).to.eql({x:1, y:2, w:3, h:4});
            });
            it('treats missing properties as undefined', function() {
                expect(GRect({x:1, y:2, w:3})).to.eql({x:1, y:2, w:3, h:undefined});
                expect(GRect({x:1, y:2})).to.eql({x:1, y:2, w:undefined, h:undefined});
                expect(GRect({x:1})).to.eql({x:1, y:undefined, w:undefined, h:undefined});
                expect(GRect({})).to.eql({x:undefined, y:undefined, w:undefined, h:undefined});
            });
        });
        describe('values', function() {
            it('works with values', function () {
                expect(GRect(1, 2, 3, 4)).to.eql({x:1, y:2, w: 3, h: 4});
            });
            it('ignores everything beyond four values', function() {
                expect(GRect(1, 2, 3, 4, 5)).to.eql({x:1, y:2, w: 3, h: 4});
            });
            it('treats missing values as undefined', function() {
                expect(GRect(1, 2, 3)).to.eql({x:1, y:2, w: 3, h: undefined});
                expect(GRect(1, 2)).to.eql({x:1, y:2, w: undefined, h: undefined});
                expect(GRect(1)).to.eql({x:1, y:undefined, w: undefined, h: undefined});
                expect(GRect()).to.eql({x:undefined, y:undefined, w: undefined, h: undefined});
            });

        });
    });
});