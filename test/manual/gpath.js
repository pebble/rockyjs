/*eslint "no-unused-expressions": 0*/
/* globals describe:false, it:false, beforeEach:false, afterEach:false */

var symbols = require('../../src/symbols-manual.js').symbols;
var expect = require('chai').expect;
var sinon = require('sinon');

describe('GPath', function() {

  var sandbox;
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    symbols.module = {ccall: function() {}};
  });

  afterEach(function() {
    sandbox.verify();
    delete symbols.module;
    sandbox.restore();
    delete global.XMLHttpRequest;
  });

  describe('gpath_create', function() {
    var gpath_create = symbols.gpath_create;
    it('creates an object from array of points', function() {
      var path = gpath_create([[1, 2], [3, 4]]);
      expect(path).to.have.property('points').eql([{x: 1, y: 2}, {x: 3, y: 4}]);
      expect(path).to.have.property('offset').eql({x: 0, y: 0});
      expect(path).to.have.property('rotation').eql(0);
      expect(path).to.have.property('captureCPointer').which.is.a('function');
      expect(path).to.have.property('releaseCPointer').which.is.a('function');
    });

    it('creates an object from array of points', function() {
      var path = gpath_create({points: [[1, 2]], offset: [2, 3], rotation: 123});
      expect(path).to.have.property('points').eql([{x: 1, y: 2}]);
      expect(path).to.have.property('offset').eql({x: 2, y: 3});
      expect(path).to.have.property('rotation').eql(123);
      expect(path).to.have.property('captureCPointer').which.is.a('function');
      expect(path).to.have.property('releaseCPointer').which.is.a('function');
    });
  });

  describe('gpath_rotate_to', function() {
    var gpath_rotate_to = symbols.gpath_rotate_to;
    it('works for common cases', function() {
      var path = {rotation: 123};
      gpath_rotate_to(path, 456);
      expect(path).to.eql({rotation: 456});
    });
  });

  describe('gpath_move_to', function() {
    var gpath_move_to = symbols.gpath_move_to;
    it('works for common cases', function() {
      var path = {offset: [1, 2]};
      gpath_move_to(path, [3, 4]);
      expect(path).to.eql({offset: {x: 3, y: 4}});
    });
  });

});
