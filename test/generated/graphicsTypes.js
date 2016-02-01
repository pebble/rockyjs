/*eslint "no-unused-expressions": 0*/
/* globals describe:false, it:false, before:false, beforeEach:false */

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
  var rocky;
  var GRect;
  var gcolor_legible_over;
  var gpoint_equal;
  var grect_equal;
  var grect_is_emtpy;
  var grect_standardize;
  var grect_clip;
  var grect_contains_point;
  var grect_center_point;
  var grect_crop;
  var grect_align;
  var gpoint_from_polar;
  var grect_centered_from_polar;
  var gbitmap_get_format;
  var gbitmap_get_bounds;

  before(function() {
    rocky = instance();
    GRect = rocky.GRect;
    gcolor_legible_over = rocky.gcolor_legible_over;
    gpoint_equal = rocky.gpoint_equal;
    grect_equal = rocky.grect_equal;
    grect_is_emtpy = rocky.grect_is_emtpy;
    grect_standardize = rocky.grect_standardize;
    grect_clip = rocky.grect_clip;
    grect_contains_point = rocky.grect_contains_point;
    grect_center_point = rocky.grect_center_point;
    grect_crop = rocky.grect_crop;
    grect_align = rocky.grect_align;
    gpoint_from_polar = rocky.gpoint_from_polar;
    grect_centered_from_polar = rocky.grect_centered_from_polar;
    gbitmap_get_format = rocky.gbitmap_get_format;
    gbitmap_get_bounds = rocky.gbitmap_get_bounds;
  });

  describe('gcolor_legible_over', function() {
    it('works for common cases', function() {
      expect(gcolor_legible_over(rocky.GColorYellow)).to.equal(rocky.GColorBlack);
    });
  });

  describe('gpoint_equal', function() {
    it('works for common cases', function() {
      expect(gpoint_equal([10, 10], [10, 10])).to.be.true;
      expect(gpoint_equal([10, 10], [5, 7])).to.be.false;
    });
  });
  describe('grect_equal', function() {
    it('works for common cases', function() {
      expect(grect_equal([1, 2, 3, 4], [1, 2, 3, 4])).to.be.true;
      expect(grect_equal([1, 2, 3, 4], [1, 2, 3, 5])).to.be.false;
    });
  });
  describe('grect_is_emtpy', function() {
    it('works for common cases', function() {
      expect(grect_is_emtpy([1, 2, 0, 0])).to.be.true;
      expect(grect_is_emtpy([1, 2, 3, 4])).to.be.false;
    });
  });
  describe('grect_standardize', function() {
    it('changes a rect', function() {
      var rect = GRect(10, 10, -5, 15);
      grect_standardize(rect);
      expect(rect).to.eql({x: 5, y: 10, w: 5, h: 15});
    });
  });
  describe('grect_clip', function() {
    it('changes a rect', function() {
      var rect = GRect(10, 10, 10, 10);
      grect_clip(rect, [15, 15, 10, 10]);
      expect(rect).to.eql({x: 15, y: 15, w: 5, h: 5});
    });
  });
  describe('grect_contains_point', function() {
    it('works for common cases', function() {
      expect(grect_contains_point([10, 10, 5, 5], [12, 12])).to.be.true;
      expect(grect_contains_point([10, 10, 5, 5], [5, 12])).to.be.false;
    });
  });
  describe('grect_center_point', function() {
    it('works for common cases', function() {
      expect(grect_center_point([10, 10, 5, 8])).to.eql({x: 12, y: 14});
    });
  });
  describe('grect_crop', function() {
    it('works for common cases', function() {
      expect(grect_crop([10, 20, 5, 8], 2)).to.eql({x: 12, y: 22, w: 1, h: 4});
    });
  });
  describe('grect_align', function() {
    it('works for common cases', function() {
      var rect = GRect(1, 2, 3, 4);
      grect_align(rect, [10, 20, 30, 40], rocky.GAlignTopLeft, false);
      expect(rect).to.eql({x: 10, y: 20, w: 3, h: 4});
    });
  });
  describe('gpoint_from_polar', function() {
    it('works for common cases', function() {
      var pt = gpoint_from_polar([10, 20, 30, 40],
                                 rocky.GOvalScaleModeFitCircle, Math.PI);
      expect(pt).to.eql({x: 24, y: 39});
    });
  });
  describe('grect_centered_from_polar', function() {
    it('works for common cases', function() {
      var rect = grect_centered_from_polar([10, 20, 30, 40],
              rocky.GOvalScaleModeFitCircle, Math.PI, [4, 5]);
      expect(rect).to.eql({x: 23, y: 52, w: 4, h: 5});
    });
  });
  describe('GBitmap', function() {
    var data = new Int8Array([0x0c,0x00,0x08,0x10,0x00,0x00,0x00,0x00,0x17,0x00,0x19,0x00,0x00,0x00,0x00,0x44,0x44,0x44,0x40,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x44,0x55,0x55,0x55,0x54,0x40,0x00,0x00,0x00,0x00,0x00,0x04,0x55,0x55,0x55,0x55,0x55,0x54,0x00,0x00,0x00,0x00,0x00,0x45,0x55,0x55,0x55,0x55,0x55,0x55,0x40,0x00,0x00,0x00,0x00,0x45,0x55,0x55,0x55,0x55,0x55,0x55,0x40,0x00,0x00,0x00,0x04,0x55,0x35,0x55,0x55,0x55,0x55,0x35,0x54,0x00,0x00,0x00,0x04,0x55,0x35,0x55,0x55,0x55,0x55,0x35,0x54,0x00,0x00,0x00,0x04,0x55,0x45,0x15,0x55,0x55,0x15,0x35,0x54,0x00,0x00,0x00,0x04,0x53,0x45,0x55,0x55,0x55,0x55,0x43,0x54,0x00,0x00,0x00,0x04,0x33,0x45,0x55,0x11,0x15,0x55,0x43,0x34,0x00,0x00,0x00,0x04,0x34,0x04,0x55,0x51,0x55,0x54,0x04,0x34,0x00,0x00,0x00,0x00,0x40,0x00,0x44,0x33,0x34,0x40,0x00,0x40,0x00,0x00,0x00,0x00,0x00,0x04,0x53,0x33,0x33,0x54,0x00,0x00,0x00,0x40,0x00,0x00,0x00,0x45,0x55,0x56,0x55,0x55,0x40,0x00,0x00,0x44,0x00,0x00,0x00,0x45,0x55,0x66,0x65,0x55,0x40,0x00,0x00,0x43,0x40,0x00,0x04,0x55,0x53,0x66,0x63,0x55,0x54,0x00,0x04,0x33,0x40,0x04,0x44,0x35,0x53,0x66,0x63,0x55,0x34,0x44,0x04,0x35,0x40,0x45,0x55,0x34,0x55,0x56,0x55,0x54,0x35,0x55,0x43,0x35,0x40,0x45,0x53,0x34,0x55,0x45,0x45,0x54,0x33,0x55,0x43,0x55,0x40,0x45,0x53,0x33,0x45,0x45,0x45,0x43,0x33,0x55,0x45,0x54,0x00,0x45,0x55,0x34,0x45,0x54,0x55,0x44,0x35,0x55,0x45,0x54,0x00,0x04,0x55,0x55,0x45,0x54,0x55,0x45,0x55,0x54,0x55,0x40,0x00,0x00,0x45,0x55,0x45,0x54,0x55,0x45,0x55,0x44,0x44,0x00,0x00,0x00,0x04,0x24,0x33,0x34,0x33,0x34,0x24,0x00,0x00,0x00,0x00,0x00,0x04,0x44,0x44,0x44,0x44,0x44,0x44,0x00,0x00,0x00,0x00,0x00,0xc0,0xe4,0xe9,0xd4,0xf9,0xfe,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00]); // eslint-disable-line
    var bmp;
    beforeEach(function() {
      bmp = rocky.gbitmap_create_with_data(data);
    });

    describe('gbitmap_get_format', function() {
      it('fails for null and undefined', function() {
        expect(function() {gbitmap_get_format(null);}).to.throw();
        expect(function() {gbitmap_get_format(undefined);}).to.throw();
      });

      it('works for common cases', function() {
        expect(gbitmap_get_format(bmp)).to.equal(4);
        bmp.data = null;
        expect(gbitmap_get_format(bmp)).to.equal(0xff);
      });
    });

    describe('gbitmap_get_bounds', function() {
      it('fails for null and undefined', function() {
        expect(function() {gbitmap_get_bounds(null);}).to.throw();
        expect(function() {gbitmap_get_bounds(undefined);}).to.throw();
      });

      it('works for common cases', function() {
        expect(gbitmap_get_bounds(bmp)).to.eql({x: 0, y: 0, w: 23, h: 25});
        bmp.data = null;
        expect(gbitmap_get_bounds(bmp)).to.eql({x: 0, y: 0, w: 0, h: 0});
      });
    });
  });

});
