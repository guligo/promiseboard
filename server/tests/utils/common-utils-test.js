var assert = require('assert');
var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
});

describe('Test common-utils.js', function() {

    var commonUtils;

    before(function(done) {
        requirejs(['../../www/js/common-utils'], function(_commonUtils) {
            commonUtils = _commonUtils;
            done();
        });
    });

    describe('#isHttpUrl(url)', function() {

        it('should return true if "http" prefix is present', function() {
            assert.equal(true, commonUtils.isHttpUrl('http://www.promiseboard.net'));
        });

        it('should return true if "https" prefix is present', function() {
            assert.equal(true, commonUtils.isHttpUrl('https://www.promiseboard.net'));
        });

        it('should return false if none of "http" or "https" prefix is present', function() {
            assert.equal(false, commonUtils.isHttpUrl('/promiseboard/index.html'));
        });

    });

    describe('#stringToBoolean(str)', function() {

        it('should return true if argument equals "true"', function() {
            assert.equal(true, commonUtils.stringToBoolean('true'));
        });

        it('should return false if argument is "false"', function() {
            assert.equal(false, commonUtils.stringToBoolean('false'));
        });

        it('should return false if argument is arbitrary string', function() {
            assert.equal(false, commonUtils.stringToBoolean('qwerty'));
        });

    });

    describe('#round(number, places)', function() {

        it('should return 1', function() {
            assert.equal(1, commonUtils.round(1, 0));
        });

        it('should return 1.1', function() {
            assert.equal(1.1, commonUtils.round(1.11, 1));
        });

        it('should return 1.123', function() {
            assert.equal(1.123, commonUtils.round(1.12345, 3));
        });

    });

});
