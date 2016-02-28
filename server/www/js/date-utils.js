define(function() {

    var _getEndOfToday = function() {
        var endOfToday = new Date();
        endOfToday.setHours(23);
        endOfToday.setMinutes(59);
        endOfToday.setSeconds(59);
        endOfToday.setMilliseconds(999);
        return endOfToday;
    };

    var _getEndOfTomorrow = function() {
        var endOfTomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        endOfTomorrow.setHours(23);
        endOfTomorrow.setMinutes(59);
        endOfTomorrow.setSeconds(59);
        endOfTomorrow.setMilliseconds(999);
        return endOfTomorrow;
    };

    var _getEndOfThisWeek = function() {
        var today = new Date();

        var startOfThisWeek = new Date(today.getTime() - ((today.getDay() - 1 >= 0 ? today.getDay() - 1 : 6) * 24 * 60 * 60  * 1000));
        startOfThisWeek.setHours(0);
        startOfThisWeek.setMinutes(0);
        startOfThisWeek.setSeconds(0);
        startOfThisWeek.setMilliseconds(0);

        var endOfThisWeek = new Date(startOfThisWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
        return endOfThisWeek;
    };

    var _getEndOfThisMonth = function() {
        var startOfNextMonth = new Date();
        startOfNextMonth.setMonth((startOfNextMonth.getMonth() + 1) % 12);
        startOfNextMonth.setDate(1);
        startOfNextMonth.setHours(0);
        startOfNextMonth.setMinutes(0);
        startOfNextMonth.setSeconds(0);
        startOfNextMonth.setMilliseconds(0);

        var endOfThisMonth = new Date(startOfNextMonth.getTime() - 1);
        return endOfThisMonth;
    };

    var _getEndOfThisYear = function() {
        var startOfNextYear = new Date();
        startOfNextYear.setFullYear(startOfNextYear.getFullYear() + 1);
        startOfNextYear.setMonth(0);
        startOfNextYear.setDate(1);
        startOfNextYear.setHours(0);
        startOfNextYear.setMinutes(0);
        startOfNextYear.setSeconds(0);
        startOfNextYear.setMilliseconds(0);

        var endOfThisYear = new Date(startOfNextYear.getTime() - 1);
        return endOfThisYear;
    };

    return {
        getEndOfToday: function() {
            return _getEndOfToday();
        },
        getEndOfTomorrow: function() {
            return _getEndOfTomorrow();
        },
        getEndOfThisWeek: function() {
            return _getEndOfThisWeek();
        },
        getEndOfThisMonth: function() {
            return _getEndOfThisMonth();
        },
        getEndOfThisYear: function() {
            return _getEndOfThisYear();
        }
    };

});
