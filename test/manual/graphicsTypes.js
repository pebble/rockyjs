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

    describe('GSize', function () {
        var GSize = symbols.GSize;
        describe('array', function() {
            it('works with arrays', function () {
                expect(GSize([1, 2])).to.eql({w:1, h:2});
            });
            it('ignores everything beyond two elements', function() {
                expect(GSize([1, 2, 3])).to.eql({w:1, h:2});
            });
            it('treats too short arrays as undefined values', function() {
                expect(GSize([1])).to.eql({w:1, h:undefined});
                var size = GSize([]);
                expect(size.w).to.equal(undefined);
                expect(size.h).to.equal(undefined);
            });
        });
        describe('object', function() {
            it('works with object', function () {
                expect(GSize({w:1, h:2})).to.eql({w:1, h:2});
            });
            it('ignores everything beyond w,h', function() {
                var obj = {w:1, h:2, z:3};
                var size = GSize(obj);
                expect(size).to.eql({w:1, h:2, z:3});
                expect(size).to.equal(obj);
            });
            it('treats missing properties as undefined', function() {
                expect(GSize({w:1})).to.eql({w:1, h:undefined});
                expect(GSize({h:2})).to.eql({w:undefined, h:2});
                expect(GSize({z:3})).to.eql({w:undefined, h:undefined, z:3});
                var size = GSize([]);
                expect(size.w).to.equal(undefined);
                expect(size.h).to.equal(undefined);
            });
        });
        describe('values', function() {
            it('works with values', function () {
                expect(GSize(1, 2)).to.eql({w:1, h:2});
            });
            it('ignores everything beyond two values', function() {
                expect(GSize(1, 2, 3)).to.eql({w:1, h:2});
            });
            it('treats missing values as undefined', function() {
                expect(GSize(1)).to.eql({w:1, h:undefined});
            });
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
                var empty = GPoint([]);
                expect(empty.x).to.equal(undefined);
                expect(empty.y).to.equal(undefined);
            });
        });
        describe('object', function() {
            it('works with object', function () {
                expect(GPoint({x:1, y:2})).to.eql({x:1, y:2});
            });
            it('ignores everything beyond x,y', function() {
                expect(GPoint({x:1, y:2, z:3})).to.eql({x:1, y:2, z:3});
            });
            it('treats missing properties as undefined', function() {
                expect(GPoint({x:1})).to.eql({x:1, y:undefined});
                expect(GPoint({y:2})).to.eql({x:undefined, y:2});
                expect(GPoint({z:3})).to.eql({x:undefined, y:undefined, z:3});
                var point = GPoint([]);
                expect(point.x).to.equal(undefined);
                expect(point.y).to.equal(undefined);
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
                var empty = GRect([]);
                expect(empty.x).to.equal(undefined);
                expect(empty.y).to.equal(undefined);
                expect(empty.w).to.equal(undefined);
                expect(empty.h).to.equal(undefined);
            });
        });
        describe('object', function() {
            it('works with object', function () {
                expect(GRect({x:1, y:2, w:3, h:4})).to.eql({x:1, y:2, w:3, h:4});
            });
            it('preserves identity x,y,w,h', function() {
                var obj = {x:1, y:2, w:3, h:4, z:5};
                var rect = GRect(obj);
                expect(rect).to.equal(obj);
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
    describe('grect_inset', function() {
        var grect_inset = symbols.grect_inset;
        var rect = {x:10, y:20, w:30, h:40};

        it('works for postive and negative insets', function() {
            expect(grect_inset(rect, {top:2, right:3, bottom:4, left:5})).to.eql({x:15, y:22, w:22, h:34});
            expect(grect_inset(rect, {top:-2, right:-3, bottom:-4, left:-5})).to.eql({x:5, y:18, w:38, h:46});
        });
        it('returns GRectZero for too large insets', function() {
            expect(grect_inset(rect, {top:100, right:50, bottom: 25, left: 12})).to.eql({x:0, y:0, w:0, h:0});
        });
    });
    describe('GEdgeInsets', function() {
        var GEdgeInsets = symbols.GEdgeInsets;
        it('accepts an array', function() {
            expect(GEdgeInsets([1, 2, 3, 4])).to.eql({top:1, right:2, bottom:3, left:4});
            expect(GEdgeInsets([1, 2, 3, 4, 5])).to.eql({top:1, right:2, bottom:3, left:4});
            expect(GEdgeInsets([1, 2, 3])).to.eql({top:1, right:2, bottom:3, left:undefined});
        });
        it('accepts an object', function() {
            expect(GEdgeInsets({top:1, right:2, bottom:3, left:4})).to.eql({top:1, right:2, bottom:3, left:4});
            expect(GEdgeInsets({top:1, right:2, bottom:3, left:4, z:5})).to.eql({top:1, right:2, bottom:3, left:4});
            expect(GEdgeInsets({top:1, right:2, bottom:3})).to.eql({top:1, right:2, bottom:3, left:undefined});
        });
        it('accepts values', function() {
            expect(GEdgeInsets()).to.eql({top:undefined, right:undefined, bottom:undefined, left:undefined});
            expect(GEdgeInsets(1)).to.eql({top:1, right:1, bottom:1, left:1});
            expect(GEdgeInsets(1, 2)).to.eql({top:1, right:2, bottom:1, left:2});
            expect(GEdgeInsets(1, 2, 3)).to.eql({top:1, right:2, bottom:3, left:2});
            expect(GEdgeInsets(1, 2, 3, 4)).to.eql({top:1, right:2, bottom:3, left:4});
            expect(GEdgeInsets(1, 2, 3, 4, 5)).to.eql({top:1, right:2, bottom:3, left:4});
        });
    });
});