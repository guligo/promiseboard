var assert = require('assert');
var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
});

describe('Test common-utils.js', function() {

    var commonUtils;

    before(function(done) {
        requirejs(['../www/js/common-utils'], function(_commonUtils) {
            commonUtils = _commonUtils;
            done();
        });
    });

    describe('#formatDate(date)', function() {

        it('should return "1/2/2016 23:59:59" for specified Date object', function() {
            var date = new Date();
            date.setDate(1);
            date.setMonth(1);
            date.setYear(2016);
            date.setHours(23);
            date.setMinutes(59);
            date.setSeconds(59);

            assert.equal('1/2/2016 23:59:59', commonUtils.formatDate(date));
        });

        it('should return "<unknown>" if argument is not provided', function() {
            assert.equal('<unknown>', commonUtils.formatDate());
        });

        it('should return "<unknown>" if argument is undefined', function() {
            assert.equal('<unknown>', commonUtils.formatDate(undefined));
        });

        it('should return "<unknown>" if argument is null', function() {
            assert.equal('<unknown>', commonUtils.formatDate(null));
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

        it('should return false if argument is not provided', function() {
            assert.equal(false, commonUtils.isHttpUrl());
        });

        it('should return false if argument is undefined', function() {
            assert.equal(false, commonUtils.isHttpUrl(undefined));
        });

        it('should return false if argument is null', function() {
            assert.equal(false, commonUtils.isHttpUrl(null));
        });

    });

});
