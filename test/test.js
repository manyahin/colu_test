var assert = require("assert");
var encoder = require('../encoder');

describe('Number Encoder', function() {
  describe('encode', function() {
    it('1 equal to 0x01', function(done) {
      var encodedBuffer = encoder.encode(1);
      var shouldBeBuffer = new Buffer('01', 'hex');

      if (!encodedBuffer.equals(shouldBeBuffer)) {
        throw new Error(encodedBuffer.toString('hex') + ' != ' + shouldBeBuffer.toString('hex'));
      }
      done();
    });
    it('1200032 equal to 0x6124fa00', function(done) {
      var encodedBuffer = encoder.encode(1200032);
      var shouldBeBuffer = new Buffer('6124fa00', 'hex');

      if (!encodedBuffer.equals(shouldBeBuffer)) {
        throw new Error(encodedBuffer.toString('hex') + ' != ' + shouldBeBuffer.toString('hex'));
      }
      done();
    });
    it('1232 equal to 0x404d00', function(done) {
      var encodedBuffer = encoder.encode(1232);
      var shouldBeBuffer = new Buffer('404d00', 'hex');

      if (!encodedBuffer.equals(shouldBeBuffer)) {
        throw new Error(encodedBuffer.toString('hex') + ' != ' + shouldBeBuffer.toString('hex'));
      }
      done();
    });
    it('1002000000 equal to 0x587684', function(done) {
      var encodedBuffer = encoder.encode(1002000000);
      var shouldBeBuffer = new Buffer('587684', 'hex');

      if (!encodedBuffer.equals(shouldBeBuffer)) {
        throw new Error(encodedBuffer.toString('hex') + ' != ' + shouldBeBuffer.toString('hex'));
      }
      done();
    });
    it('928867423145164 equal to 0xc34ccccccccccc', function(done) {
      var encodedBuffer = encoder.encode(928867423145164);
      var shouldBeBuffer = new Buffer('c34ccccccccccc', 'hex');

      if (!encodedBuffer.equals(shouldBeBuffer)) {
        throw new Error(encodedBuffer.toString('hex') + ' != ' + shouldBeBuffer.toString('hex'));
      }
      done();
    });
    it('132300400000 equal to 0x6c9dfd84', function(done) {
      var encodedBuffer = encoder.encode(132300400000);
      var shouldBeBuffer = new Buffer('6c9dfd84', 'hex');

      if (!encodedBuffer.equals(shouldBeBuffer)) {
        throw new Error(encodedBuffer.toString('hex') + ' != ' + shouldBeBuffer.toString('hex'));
      }
      done();
    });
  });
});