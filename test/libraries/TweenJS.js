/*eslint "no-unused-expressions": 0*/
/*eslint max-len: [2, 100, 4]*/
/* globals describe:false, it:false, xit: false */
/* globals before:false, beforeEach: false, afterEach: false */

var TweenJS = require('../../examples/webapis/js/rocky-TweenJS');
var expect = require('chai').expect;

describe('TweenJS', function() {
  beforeEach(function() {
    TweenJS._reset();
  });

  it('supports executeWithin', function() {
    // TODO: register mocks

    var t = TweenJS.tween({});
    expect(t._executeWithin(0)).to.be.undefined;

    t.wait(100);
    expect(t._executeWithin(0)).to.equal(100);
    expect(t._executeWithin(20)).to.equal(80);
    expect(t._executeWithin(60)).to.equal(20);

    t.to({a: 10}, 200);
    expect(t._executeWithin(20)).to.equal(true);
    expect(t._executeWithin(100)).to.equal(true);
    expect(t._executeWithin(100)).to.be.undefined;
  });

  it('supports getValues and setValues', function() {
    var o = {a: 1, b: true, c: {a: 'a string', b: 321}};
    var values = TweenJS._getValues(o, {
      'b': false, 'c.a': 123, 'does.not.exist': 'foo'
    });
    expect(values).to.eql({
      'b': true,
      'c.a': 'a string',
      'does.not.exist': undefined
    });
    TweenJS._setValues(o, {
      a: 'new value',
      'c.a': 123,
      'c.newKey': true,
      'does.not.exist': 'foo'
    });
    expect(o).to.eql({
      a: 'new value', b: true, c: {a: 123, b: 321, newKey: true}
    });
  });

  it('supports interpolate', function() {
    var from = {
      a: 'a old',
      b: false,
      c: 100,
      d: -100,
      e: undefined,
      f: {
        a: 123,
        onlyOnFrom: 'foo'
      }
    };
    var to = {
      a: 'a new',
      b: true,
      c: 200,
      d: undefined,
      e: 100,
      f: {
        a: 456,
        onlyOnTo: 'bar'
      }
    };
    var actual;

    actual = TweenJS._interpolate(from, to, 0);
    expect(actual).to.eql(from);

    actual = TweenJS._interpolate(from, to, 0.49);
    expect(actual).to.eql({
      a: 'a old',
      b: false,
      c: 149,
      d: -100,
      e: undefined,
      f: {
        a: 286.17,
        onlyOnFrom: 'foo'
      }
    });

    actual = TweenJS._interpolate(from, to, 0.50);
    expect(actual).to.eql({
      a: 'a new',
      b: true,
      c: 150,
      d: undefined,
      e: 100,
      f: {
        a: 289.5,
        onlyOnTo: 'bar'
      }
    });

    actual = TweenJS._interpolate(from, to, 1);
    expect(actual).to.eql(to);
  });

});
