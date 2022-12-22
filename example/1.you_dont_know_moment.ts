import moment from 'moment';
import dayjs from 'dayjs';
import parse from 'date-fns/parse';

const mmm = require('moment');
//------------------------------ Parse ------------------------------

// String + Date Format
moment('12-25-1995', 'MM-DD-YYYY');
// => "1995-12-24T13:00:00.000Z"

// String + Time Format
moment('2010-10-20 4:30', 'YYYY-MM-DD HH:mm');
// => "2010-

// String + Format + locale
moment('2012 mars', 'YYYY MMM', 'fr');
// => "2012-02-29T13:00:00.000Z"

//------------------------------ Get + Set ------------------------------
moment().seconds();
// => 49
moment().hours();
// => 19

moment().seconds(30);
// => "2018-09-09T09:12:30.695Z"
moment().hours(13);
// => "2018-09-09T03:12:49.695Z"

moment().date();
// => 9
moment().dates(4);
// => "2018-09-04T09:12:49.695Z"

moment().day();
// => 0 (Sunday)
moment().days(-14);
// => "2018-08-26T09:12:49.695Z"

moment().dayOfYear();
// => 252
moment().dayOfYear(256);
// => "2018-09-13T09:12:49.695Z"

moment().week();
// => 37
moment().weeks(24);
// => "2018-06-10T09:12:49.695Z"

moment('2012-02', 'YYYY-MM').daysInMonth();
// => 29

moment().isoWeeksInYear();
// => 52

const array = [
  new Date(2017, 4, 13),
  new Date(2018, 2, 12),
  new Date(2016, 0, 10),
  new Date(2016, 0, 9),
];
// Moment.js
moment.max(array.map((a) => moment(a)));
// => "2018-03-11T13:00:00.000Z"

// Moment.js
moment.min(array.map((a) => moment(a)));
// => "2016-01-08T13:00:00.000Z"

//------------------------------ Manipulate ------------------------------
moment().add(7, 'days'); //  TODO:
// => "2018-09-16T09:12:49.695Z"

moment().subtract(7, 'days');
// => "2018-09-02T09:12:49.695Z"

moment().startOf('month');
// => "2018-08-31T14:00:00.000Z"

moment().endOf('day');
// => "2018-09-09T13:59:59.999Z"

//------------------------------ Display ------------------------------
moment().format('dddd, MMMM Do YYYY, h:mm:ss A');
// => "Sunday, September 9th 2018, 7:12:49 PM"
moment().format('ddd, hA');
// => "Sun, 7PM"

moment(1536484369695).fromNow();
// => "4 days ago"

moment([2007, 0, 27]).to(moment([2007, 0, 29]));
// => "in 2 days"

moment([2007, 0, 27]).diff(moment([2007, 0, 29]));
// => -172800000
moment([2007, 0, 27]).diff(moment([2007, 0, 29]), 'days'); // TODO:
// => -2

//------------------------------ Query ------------------------------
moment('2010-10-20').isBefore('2010-10-21');
// => true

moment('2010-10-20').isSame('2010-10-21');
// => false
moment('2010-10-20').isSame('2010-10-20');
// => true
moment('2010-10-20').isSame('2010-10-21', 'month');
// => true

moment('2010-10-20').isAfter('2010-10-19');
// => true

moment('2010-10-20').isBetween('2010-10-19', '2010-10-25');
// => true

moment([2000]).isLeapYear();
// => true

//------------------------------ Static method ------------------------------
moment.isDate(new Date()); // not work

moment.isMoment(moment());

moment.min(moment());
