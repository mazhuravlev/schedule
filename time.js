(function (global) {

    function Interval(start, end) {
        this.start = start;
        this.end = end;
    }

    Interval.prototype.getTimestampInterval = function () {
        var a = new Interval(this.start.getTime(), this.end.getTime());
        a.oldInterval = this;
        return a;
    };

    function makeDate(hour, minute) {
        var date = new Date();
        date.setHours(hour);
        date.setMinutes(minute || 0);
        date.setSeconds(0);
        return date;
    }

    function generateHoursIntervals(startHour, endHour) {
        if (endHour < startHour) {
            throw new Error;
        }
        return _.range(startHour, endHour).map(
            hour => new Interval(makeDate(hour), makeDate(hour + 1))
        );
    }

    function calculateIntersection(ia, ib) {
        if (ib.start < ia.start) {
            [ia, ib] = [ib, ia];
        }
        if (ia.end <= ib.start) {
            return 0;
        } else if (ia.end <= ib.end) {
            return ia.end - ib.start;
        } else if (ia.end > ib.end) {
            return ib.end - ib.start;
        } else {
            throw new Error;
        }
    }

    function getBusyMinutes(schedule, startHour, endHour) {
        var hours = generateHoursIntervals(startHour, endHour);
        return hours.map(
            hourInterval => {
                var busyMilliseconds = 0;
                for (i in schedule) {
                    busyMilliseconds += calculateIntersection(
                        hourInterval.getTimestampInterval(), schedule[i].getTimestampInterval()
                    );
                }
                hourInterval.busyMinutes = Math.round(busyMilliseconds / 60000);
                return hourInterval;
            }
        );
    }

    global.Schedule = {
        Interval: Interval,
        getBusyMinutes: getBusyMinutes,
        makeDate: makeDate
    };

})(window);
