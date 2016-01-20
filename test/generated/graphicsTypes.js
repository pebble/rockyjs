/*eslint "no-unused-expressions": 0*/
/* globals describe:false, it:false */

var Module = require('../../src/transpiled.js');
var addManualSymbols = require('../../src/symbols-manual.js').addManualSymbols;
var addGeneratedSymbols =
    require('../../src/symbols-generated.js').addGeneratedSymbols;
var expect = require('chai').expect;

function instance() {
  var rocky = {module: Module()};
  addManualSymbols(rocky);
  addGeneratedSymbols(rocky);
  return rocky;
}

describe('Module', function() {
  it('exists', function() {
    expect(Module).to.not.be.an('undefined');
  });

  it('can create instances', function() {
    expect(instance()).to.not.be.an('undefined');
  });

  it('grants access to functions', function() {
    expect(instance().grect_standardize).to.be.a('function');
  });
});

describe('Graphic Types', function() {
  var rocky = instance();
  var GRect = rocky.GRect;

  describe('gcolor_legible_over', function() {
    var gcolor_legible_over = rocky.gcolor_legible_over;
    it('works for common cases', function() {
      expect(gcolor_legible_over(rocky.GColorYellow)).to.equal(rocky.GColorBlack);
    });
  });

  describe('gpoint_equal', function() {
    var gpoint_equal = rocky.gpoint_equal;
    it('works for common cases', function() {
      expect(gpoint_equal([10, 10], [10, 10])).to.be.true;
      expect(gpoint_equal([10, 10], [5, 7])).to.be.false;
    });
  });
  describe('grect_equal', function() {
    var grect_equal = rocky.grect_equal;
    it('works for common cases', function() {
      expect(grect_equal([1, 2, 3, 4], [1, 2, 3, 4])).to.be.true;
      expect(grect_equal([1, 2, 3, 4], [1, 2, 3, 5])).to.be.false;
    });
  });
  describe('grect_is_emtpy', function() {
    var grect_is_emtpy = rocky.grect_is_emtpy;
    it('works for common cases', function() {
      expect(grect_is_emtpy([1, 2, 0, 0])).to.be.true;
      expect(grect_is_emtpy([1, 2, 3, 4])).to.be.false;
    });
  });
  describe('grect_standardize', function() {
    var grect_standardize = rocky.grect_standardize;
    it('changes a rect', function() {
      var rect = GRect(10, 10, -5, 15);
      grect_standardize(rect);
      expect(rect).to.eql({x: 5, y: 10, w: 5, h: 15});
    });
  });
  describe('grect_clip', function() {
    var grect_clip = rocky.grect_clip;
    it('changes a rect', function() {
      var rect = GRect(10, 10, 10, 10);
      grect_clip(rect, [15, 15, 10, 10]);
      expect(rect).to.eql({x: 15, y: 15, w: 5, h: 5});
    });
  });
  describe('grect_contains_point', function() {
    var grect_contains_point = rocky.grect_contains_point;
    it('works for common cases', function() {
      expect(grect_contains_point([10, 10, 5, 5], [12, 12])).to.be.true;
      expect(grect_contains_point([10, 10, 5, 5], [5, 12])).to.be.false;
    });
  });
  describe('grect_center_point', function() {
    var grect_center_point = rocky.grect_center_point;
    it('works for common cases', function() {
      expect(grect_center_point([10, 10, 5, 8])).to.eql({x: 12, y: 14});
    });
  });
  describe('grect_crop', function() {
    var grect_crop = rocky.grect_crop;
    it('works for common cases', function() {
      expect(grect_crop([10, 20, 5, 8], 2)).to.eql({x: 12, y: 22, w: 1, h: 4});
    });
  });
  describe('grect_align', function() {
    var grect_align = rocky.grect_align;
    it('works for common cases', function() {
      var rect = GRect(1, 2, 3, 4);
      grect_align(rect, [10, 20, 30, 40], rocky.GAlignTopLeft, false);
      expect(rect).to.eql({x: 10, y: 20, w: 3, h: 4});
    });
  });
  describe('gpoint_from_polar', function() {
    var gpoint_from_polar = rocky.gpoint_from_polar;
    it('works for common cases', function() {
      var pt = gpoint_from_polar([10, 20, 30, 40],
                                 rocky.GOvalScaleModeFitCircle, Math.PI);
      expect(pt).to.eql({x: 24, y: 39});
    });
  });
  describe('grect_centered_from_polar', function() {
    var grect_centered_from_polar = rocky.grect_centered_from_polar;
    it('works for common cases', function() {
      var rect = grect_centered_from_polar([10, 20, 30, 40],
              rocky.GOvalScaleModeFitCircle, Math.PI, [4, 5]);
      expect(rect).to.eql({x: 23, y: 52, w: 4, h: 5});
    });
  });
});
