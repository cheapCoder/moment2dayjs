const moment = require('moment')

const {Moment} = require('moment')
var duration = moment.duration({'days' : 1});

var a = moment.utc([2011, 0, 1, 8]);

moment.parseZone('2016-05-03T22:15:01+02:00').local().format();

moment.isMoment(new Date()) // false

moment.isDate(new Date()); // true

moment.locale("");

moment.months()
moment.monthsShort()
moment.weekdays()
moment.weekdaysShort()
moment.weekdaysMin()

moment.unix(132123123)

moment.max()
moment.min