var assert = require('assert');
var requirejs = require('requirejs');

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
});

describe('Test date-utils.js', function() {

    var dateUtils;

    before(function(done) {
        requirejs(['../../www/js/date-utils'], function(_dateUtils) {
            dateUtils = _dateUtils;
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

            assert.equal('1/2/2016 23:59:59', dateUtils.formatDate(date));
        });

        it('should return "<unknown>" if argument is not provided', function() {
            assert.equal('<unknown>', dateUtils.formatDate());
        });

    });

});
