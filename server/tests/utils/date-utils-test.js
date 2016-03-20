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

    describe('#calculateTimeLeft(dueDate)', function() {

        it('should return "2 days, 2 hours, 30 minutes"', function() {
            var date = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 30 * 60 * 1000);

            var assertion = (
                '2 days, 2 hours, 29 minutes' === dateUtils.calculateTimeLeft(date) ||
                '2 days, 2 hours, 30 minutes' === dateUtils.calculateTimeLeft(date)
            );
            assert.equal(true, assertion);
        });

    });

    describe('#dateBefore(date1, date2)', function() {

        it('should return "true" if date1 is 1 second before date2', function() {
            var date = new Date();
            assert.equal(true, dateUtils.dateBefore(date, new Date(date.getTime() + 1000)));
        });

        it('should return "false" if date1 equals date2', function() {
            var date = new Date();
            assert.equal(false, dateUtils.dateBefore(date, date));
        });

    });

    describe('#dateBeforeOrEquals(date1, date2)', function() {

        it('should return "true" if date1 is 3 second before date2', function() {
            var date = new Date();
            assert.equal(true, dateUtils.dateBeforeOrEquals(date, new Date(date.getTime() + 3 * 1000)));
        });

        it('should return "true" if date1 equals date2', function() {
            var date = new Date();
            assert.equal(true, dateUtils.dateBeforeOrEquals(date, date));
        });

    });

    describe('#dateAfter(date1, date2)', function() {

        it('should return "true" if date1 is 1 second after date2', function() {
            var date = new Date();
            assert.equal(true, dateUtils.dateAfter(date, new Date(date.getTime() - 1000)));
        });

        it('should return "false" if date1 equals date2', function() {
            var date = new Date();
            assert.equal(false, dateUtils.dateAfter(date, date));
        });

    });

    describe('#dateAfterOrEquals(date1, date2)', function() {

        it('should return "true" if date1 is 3 second after date2', function() {
            var date = new Date();
            assert.equal(true, dateUtils.dateAfterOrEquals(date, new Date(date.getTime() - 3 * 1000)));
        });

        it('should return "true" if date1 equals date2', function() {
            var date = new Date();
            assert.equal(true, dateUtils.dateBeforeOrEquals(date, date));
        });

    });

    describe('#dateEquals(date1, date2)', function() {

        it('should return "true" if date1 equals date2', function() {
            var date = new Date();
            assert.equal(true, dateUtils.dateEquals(date, date));
        });

        it('should return "false" if date1 not equals date2', function() {
            assert.equal(false, dateUtils.dateBeforeOrEquals(new Date(), new Date(0)));
        });

    });

    describe('#getEndOfToday()', function() {

        it('should return today', function() {
            var date = dateUtils.getEndOfToday();
            assert.equal(24 * 60 * 60 * 1000 + date.getTimezoneOffset() * 60 * 1000 - 1, date.getTime() % (24 * 60 * 60 * 1000));
        });

    });

    describe('#getEndOfTomorrow()', function() {

        it('should return tomorrow', function() {
            var date = dateUtils.getEndOfTomorrow();
            assert.equal(24 * 60 * 60 * 1000 + date.getTimezoneOffset() * 60 * 1000 - 1, date.getTime() % (24 * 60 * 60 * 1000));
        });

    });

    describe('#getEndOfThisWeek()', function() {

        it('should return this week', function() {
            var date = dateUtils.getEndOfThisWeek();
            // TODO: More specific assertion required
            assert.equal(24 * 60 * 60 * 1000 + date.getTimezoneOffset() * 60 * 1000 - 1, date.getTime() % (24 * 60 * 60 * 1000));
        });

    });

    describe('#getEndOfThisMonth()', function() {

        it('should return this month', function() {
            var date = dateUtils.getEndOfThisMonth();
            // TODO: More specific assertion required
            assert.equal(24 * 60 * 60 * 1000 + date.getTimezoneOffset() * 60 * 1000 - 1, date.getTime() % (24 * 60 * 60 * 1000));
        });

    });

    describe('#getEndOfThisYear()', function() {

        it('should return this year', function() {
            var date = dateUtils.getEndOfThisYear();
            // TODO: More specific assertion required
            assert.equal(24 * 60 * 60 * 1000 + date.getTimezoneOffset() * 60 * 1000 - 1, date.getTime() % (24 * 60 * 60 * 1000));
        });

    });

});
