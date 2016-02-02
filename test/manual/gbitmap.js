/*eslint "no-unused-expressions": 0*/
/*eslint max-len: [2, 100, 4]*/
/* globals describe:false, it:false, beforeEach:false, afterEach:false */

global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var symbols = require('../../src/symbols-manual.js').symbols;
var expect = require('chai').expect;
var sinon = require('sinon');
global.atob = require('atob');

describe('GBitmap', function() {

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

  describe('gbitmap_create', function() {
    var gbitmap_create = symbols.gbitmap_create;
    it('creates an object with expected fields', function() {
      var bmp = gbitmap_create();
      expect(bmp).to.be.an('object');
      expect(bmp.status).to.be.a('string');
      expect(bmp.captureCPointer).to.be.a('function');
      expect(bmp.releaseCPointer).to.be.a('function');
    });

    it('implements captureCPointer for pbi', function() {
      var bmp = gbitmap_create();
      bmp.data = 'some data';
      sandbox.mock(symbols.Data)
        .expects('captureCPointerWithData').once().withArgs('some data')
        .returns([123, 10]);
      sandbox.mock(symbols.module)
        .expects('ccall').once()
        .withArgs('gbitmap_create_with_data', 'number', ['number'], [123])
        .returns(456);

      expect(bmp.captureCPointer()).to.equal(456);
      expect(bmp.dataPtr).to.equal(123);
      expect(bmp.bmpPtr).to.equal(456);
    });

    it('implements captureCPointer for png', function() {
      var bmp = gbitmap_create();
      bmp.data = 'some data';
      bmp.dataFormat = 'png';
      sandbox.mock(symbols.Data)
        .expects('captureCPointerWithData').once().withArgs('some data')
        .returns([123, 10]);
      sandbox.mock(symbols.module)
        .expects('ccall').once()
        .withArgs('gbitmap_create_from_png_data', 'number',
          ['number', 'number'], [123, 10])
        .returns(456);

      expect(bmp.captureCPointer()).to.equal(456);
      expect(bmp.dataPtr).to.equal(123);
      expect(bmp.bmpPtr).to.equal(456);
    });

    it('implements releaseCPointer with Data and module', function() {
      var bmp = gbitmap_create();
      bmp.dataPtr = 123;
      bmp.bmpPtr = 456;

      sandbox.mock(symbols.module)
        .expects('ccall').once()
        .withArgs('gbitmap_destroy', 'void', ['number'], [456]);
      sandbox.mock(symbols.Data)
        .expects('releaseCPointer').once().withArgs(123);

      bmp.releaseCPointer(bmp.bmpPtr);
      expect(bmp.dataPtr).to.be.undefined;
      expect(bmp.bmpPtr).to.be.undefined;
    });

    it('reflects status and data according to Recources singleton', function() {
      var expectation = sandbox.mock(symbols.Resources)
        .expects('load').once().withArgs({url: 'someUrl', convertPath: '/convert/image'})
        .returns('someInitialStatus');
      var bmp = gbitmap_create('someUrl');
      var dataCallback = expectation.firstCall.args[1];
      expect(dataCallback).to.be.a('function');

      expect(bmp.status).to.equal('someInitialStatus');
      var base64encoded = 'c29tZSBkYXRh'; // "some data"
      dataCallback('new status', {output: {data: base64encoded}});
      expect(bmp.status).to.equal('new status');
      expect(bmp.data).to.equal('some data');
    });

    describe('.onload and .onerror', function() {
      var bmp;
      var server;

      beforeEach(function() {
        server = sinon.fakeServer.create();
      });

      afterEach(function() {
        bmp.onload.verify();
        bmp.onerror.verify();
        server.restore();
      });

      it('calls .onload on success', function() {
        server.respondWith('GET', symbols.Resources.defaultProxy + '/convert/image?url=someUrl',
          [200, { 'Content-Type': 'application/json' },
          '{"output": {"data": "c29tZSBkYXRh", "outputFormat": "png"}}']);
        // c29tZSBkYXRh is "some data" in base64

        bmp = gbitmap_create('someUrl');
        expect(bmp.status).to.equal('loading');

        bmp.onload = sinon.expectation.create('onload').once();
        bmp.onerror = sinon.expectation.create('onerror').never();

        server.respond();
        expect(bmp.status).to.equal('loaded');
        expect(bmp.data).to.equal('some data');
        expect(bmp.dataFormat).to.equal('png');
      });

      it('calls .onerror on failure', function() {
        bmp = gbitmap_create('someUrl');
        expect(bmp.status).to.equal('loading');

        bmp.onload = sinon.expectation.create('onload').never();
        bmp.onerror = sinon.expectation.create('onerror').once();

        server.respond();
        expect(bmp.status).to.equal('error'); // 404
      });
    });
  });

  describe('gbitmap_create_with_data', function() {
    it('simply passes the data', function() {
      var bmp = symbols.gbitmap_create_with_data('some data');
      expect(bmp).to.be.an('object');
      expect(bmp.status).to.equal('loaded');
      expect(bmp.data).to.equal('some data');
      expect(bmp.captureCPointer).to.be.a('function');
      expect(bmp.releaseCPointer).to.be.a('function');
    });

    it('handles undefined data', function() {
      var bmp = symbols.gbitmap_create_with_data();
      sandbox.mock(symbols.Data)
        .expects('captureCPointerWithData').once().withArgs(undefined).returns(0);
      sandbox.mock(symbols.module)
        .expects('ccall').never();
      expect(bmp.captureCPointer()).to.equal(0);
    });
  });

  describe('Resources', function() {
    beforeEach(function() {
      this.defaultProxy = symbols.Resources.defaultProxy;
    });

    afterEach(function() {
      symbols.Resources.defaultProxy = this.defaultProxy;
    });

    describe('constructURL', function() {
      it('can handle errorneous cases', function() {
        var url = symbols.Resources.constructURL(undefined);
        expect(url).to.be.undefined;

        url = symbols.Resources.constructURL({});
        expect(url).to.be.undefined;
      });

      it('has a default proxy', function() {
        expect(symbols.Resources.defaultProxy).to.equal('http://butkus.pebbledev.com');
      });

      it('can handle a proxy', function() {
        var config = {
          url: 'http://foo.com?bar=baz',
          proxy: 'http://proxy.com'
        };
        var url = symbols.Resources.constructURL(config);
        expect(url).to.equal(
          'http://proxy.com?url=http%3A%2F%2Ffoo.com%3Fbar%3Dbaz'
        );

        config.convertPath = '/convert/image';
        url = symbols.Resources.constructURL(config);
        expect(url).to.equal(
          'http://proxy.com/convert/image?url=http%3A%2F%2Ffoo.com%3Fbar%3Dbaz'
        );
      });

      it('can handle a default proxy and URL', function() {
        delete symbols.Resources.defaultProxy;
        var url = symbols.Resources.constructURL({url: 'http://foo.com?bar=baz'});
        expect(url).to.equal('http://foo.com?bar=baz');
        url = symbols.Resources.constructURL({
          url: 'http://foo.com?bar=baz', convertPath: '/p'});
        expect(url).to.equal('http://foo.com?bar=baz');

        symbols.Resources.defaultProxy = 'http://proxy.com';
        url = symbols.Resources.constructURL({url: 'http://foo.com?bar=baz'});
        expect(url).to.equal(
          'http://proxy.com?url=http%3A%2F%2Ffoo.com%3Fbar%3Dbaz'
        );
        url = symbols.Resources.constructURL({
          url: 'http://foo.com?bar=baz', convertPath: '/p'});
        expect(url).to.equal(
          'http://proxy.com/p?url=http%3A%2F%2Ffoo.com%3Fbar%3Dbaz'
        );

        url = symbols.Resources.constructURL({
          url: 'http://foo.com?bar=baz',
          proxy: 'http://overrulingProxy.com'
        });
        expect(url).to.equal(
          'http://overrulingProxy.com?url=http%3A%2F%2Ffoo.com%3Fbar%3Dbaz'
        );
        url = symbols.Resources.constructURL({
          url: 'http://foo.com?bar=baz',
          proxy: 'http://overrulingProxy.com',
          convertPath: '/p'
        });
        expect(url).to.equal(
          'http://overrulingProxy.com/p?url=http%3A%2F%2Ffoo.com%3Fbar%3Dbaz'
        );

        delete symbols.Resources.defaultProxy;
      });

      it('prefers dataURL over anything else', function() {
        var url = symbols.Resources.constructURL({
          dataURL: 'dataURL',
          url: 'http://foo.com?bar=baz',
          proxy: 'http://proxy.com'
        });
        expect(url).to.equal('dataURL');
      });
    });
  });

});
