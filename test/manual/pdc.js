/*eslint "no-unused-expressions": 0*/
/*eslint max-len: [2, 100, 4]*/
/* globals describe:false, it:false */
/* globals before:false, beforeEach: false */

var Module = require('../../src/transpiled.js');
var addManualSymbols = require('../../src/symbols-manual.js').addManualSymbols;
var addGeneratedSymbols =
  require('../../src/symbols-generated.js').addGeneratedSymbols;
var expect = require('chai').expect;
// var sinon = require('sinon');
global.atob = require('atob');

describe('PDC', function() {
  var rocky;
  before(function() {
    rocky = {
      module: Module()
    };
    addManualSymbols(rocky);
    addGeneratedSymbols(rocky);
  });

  describe('gdraw_command_image', function() {
    var pdc;

    beforeEach(function() {
      var pdcData = [0x50, 0x44, 0x43, 0x49, 0x3d, 0x01, 0x00, 0x00, 0x01, 0x00, 0x50, 0x00, 0x50, 0x00, 0x0d, 0x00, 0x03, 0x00, 0xc0, 0x04, 0xff, 0x00, 0x00, 0x06, 0x00, 0x2c, 0x01, 0xc4, 0x01, 0x2c, 0x01, 0xfc, 0x01, 0xac, 0x00, 0x24, 0x02, 0xac, 0x00, 0xec, 0x01, 0xfc, 0x00, 0xd4, 0x01, 0xfc, 0x00, 0x94, 0x01, 0x03, 0x00, 0xc0, 0x04, 0xff, 0x00, 0x00, 0x0e, 0x00, 0x84, 0x01, 0xc4, 0x01, 0x2c, 0x01, 0xc4, 0x01, 0xdc, 0x00, 0x74, 0x01, 0xdc, 0x00, 0xfc, 0x00, 0x4c, 0x01, 0x8c, 0x00, 0x2c, 0x01, 0x6c, 0x00, 0x2c, 0x01, 0x14, 0x00, 0x84, 0x01, 0x14, 0x00, 0x64, 0x02, 0xf4, 0x00, 0xe4, 0x01, 0xf4, 0x00, 0x84, 0x01, 0x54, 0x01, 0xbc, 0x01, 0x54, 0x01, 0xbc, 0x01, 0x14, 0x02, 0x84, 0x01, 0xdc, 0x01, 0x03, 0x00, 0xc0, 0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0xbc, 0x01, 0x9c, 0x00, 0xbc, 0x01, 0x9c, 0x00, 0x03, 0x00, 0xc0, 0x03, 0x00, 0x01, 0x00, 0x05, 0x00, 0xd8, 0x00, 0x78, 0x01, 0x88, 0x00, 0x78, 0x01, 0x48, 0x00, 0x38, 0x01, 0x48, 0x00, 0xc0, 0x00, 0x10, 0x00, 0x88, 0x00, 0x03, 0x00, 0xc0, 0x03, 0x00, 0x01, 0x00, 0x03, 0x00, 0x50, 0x01, 0x90, 0x00, 0x60, 0x01, 0xa0, 0x00, 0x80, 0x01, 0xa0, 0x00, 0x03, 0x00, 0xc0, 0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0x84, 0x01, 0xc4, 0x01, 0x84, 0x01, 0x94, 0x01, 0x03, 0x00, 0xc0, 0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0x84, 0x01, 0x54, 0x01, 0x3c, 0x01, 0x54, 0x01, 0x03, 0x00, 0xc0, 0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0xbc, 0x01, 0x14, 0x02, 0xd4, 0x01, 0x2c, 0x02, 0x03, 0x00, 0xc0, 0x04, 0xff, 0x01, 0x00, 0x04, 0x00, 0x04, 0x02, 0x54, 0x01, 0xc4, 0x01, 0x14, 0x01, 0x7c, 0x01, 0x14, 0x01, 0x7c, 0x01, 0xe4, 0x00, 0x03, 0x00, 0xc0, 0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0xac, 0x00, 0x24, 0x02, 0xac, 0x00, 0x4c, 0x02, 0x03, 0x00, 0xc0, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x60, 0x01, 0x48, 0x00, 0x78, 0x01, 0x60, 0x00, 0x03, 0x00, 0xc0, 0x04, 0x00, 0x01, 0x00, 0x02, 0x00, 0x44, 0x02, 0xd4, 0x00, 0x24, 0x02, 0xf4, 0x00, 0x03, 0x00, 0xc0, 0x03, 0x00, 0x01, 0x00, 0x02, 0x00, 0x08, 0x00, 0x70, 0x02, 0xf8, 0x01, 0x70, 0x02]; // eslint-disable-line
      pdc = rocky.gdraw_command_image_create_with_data(pdcData);
    });

    it('supports bounds_size', function() {
      var size = rocky.gdraw_command_image_get_bounds_size(pdc);
      expect(size).to.eql({w: 80, h: 80});
      rocky.gdraw_command_image_set_bounds_size(pdc, [100, 200]);
      size = rocky.gdraw_command_image_get_bounds_size(pdc);
      expect(size).to.eql({w: 100, h: 200});
    });

    describe('List and Commands', function() {
      var list, command;
      beforeEach(function() {
        list = rocky.gdraw_command_image_get_command_list(pdc);
        command = rocky.gdraw_command_list_get_command(list, 5);
      });

      it('supports gdraw_command_image_get_command_list', function() {
        expect(list).to.have.a.property('captureCPointer').which.is.a('function');
        expect(list).to.have.a.property('releaseCPointer').which.is.a('function');
      });

      it('supports gdraw_command_list_get_num_commands', function() {
        var num = rocky.gdraw_command_list_get_num_commands(list);
        expect(num).to.equal(13);
      });

      it('supports gdraw_command_list_get_command', function() {
        expect(command).to.have.a.property('captureCPointer').which.is.a('function');
        expect(command).to.have.a.property('releaseCPointer').which.is.a('function');
      });

      it('supports gdraw_command_get_type', function() {
        var type = rocky.gdraw_command_get_type(command);
        expect(type).to.equal(rocky.GDrawCommandTypePrecisePath);
      });

      it('supports stroke_width', function() {
        var width = rocky.gdraw_command_get_stroke_width(command);
        expect(width).to.equal(4);
        rocky.gdraw_command_set_stroke_width(command, 5);
        width = rocky.gdraw_command_get_stroke_width(command);
        expect(width).to.equal(5);
      });

      it('supports path_open', function() {
        var width = rocky.gdraw_command_get_path_open(command);
        expect(width).to.equal(true);
        rocky.gdraw_command_set_path_open(command, false);
        width = rocky.gdraw_command_get_path_open(command);
        expect(width).to.equal(false);
      });

      it('supports hidden', function() {
        var width = rocky.gdraw_command_get_hidden(command);
        expect(width).to.equal(false);
        rocky.gdraw_command_set_hidden(command, true);
        width = rocky.gdraw_command_get_hidden(command);
        expect(width).to.equal(true);
      });

      it('supports radius', function() {
        var radius = rocky.gdraw_command_get_radius(command);
        expect(radius).to.equal(0);

        rocky.gdraw_command_set_radius(command, 23);
        // setting the radius on a path shouldn't have any effect
        radius = rocky.gdraw_command_get_radius(command);
        expect(radius).to.equal(0);
      });

      it('supports points', function() {
        var numPoints = rocky.gdraw_command_get_num_points(command);
        expect(numPoints).to.equal(2);
        var point = rocky.gdraw_command_get_point(command, 1);
        expect(point).to.eql({x: 388, y: 404});

        point.x += 1;
        point.y += 2;
        rocky.gdraw_command_set_point(command, 1, point);
        point = rocky.gdraw_command_get_point(command, 1);
        expect(point).to.eql({x: 389, y: 406});
      });

      it('supports fill color', function() {
        var color = rocky.gdraw_command_get_fill_color(command);
        expect(color).to.equal(rocky.GColorClear);

        rocky.gdraw_command_set_fill_color(command, rocky.GColorRed);
        color = rocky.gdraw_command_get_fill_color(command);
        expect(color).to.equal(rocky.GColorRed);
      });

      it('supports stroke color', function() {
        var color = rocky.gdraw_command_get_stroke_color(command);
        expect(color).to.equal(rocky.GColorBlack);

        rocky.gdraw_command_set_stroke_color(command, rocky.GColorRed);
        color = rocky.gdraw_command_get_stroke_color(command);
        expect(color).to.equal(rocky.GColorRed);
      });

    });
  });
});
