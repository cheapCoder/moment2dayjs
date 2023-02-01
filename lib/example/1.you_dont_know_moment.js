"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const mmm = require('moment');
//------------------------------ Parse ------------------------------
// String + Date Format
(0, moment_1.default)('12-25-1995', 'MM-DD-YYYY');
// => "1995-12-24T13:00:00.000Z"
// String + Time Format
(0, moment_1.default)('2010-10-20 4:30', 'YYYY-MM-DD HH:mm');
// => "2010-
// String + Format + locale
(0, moment_1.default)('2012 mars', 'YYYY MMM', 'fr');
// => "2012-02-29T13:00:00.000Z"
//------------------------------ Get + Set ------------------------------
(0, moment_1.default)().seconds();
// => 49
(0, moment_1.default)().hours();
// => 19
(0, moment_1.default)().seconds(30);
// => "2018-09-09T09:12:30.695Z"
(0, moment_1.default)().hours(13);
// => "2018-09-09T03:12:49.695Z"
(0, moment_1.default)().date();
// => 9
(0, moment_1.default)().dates(4);
// => "2018-09-04T09:12:49.695Z"
(0, moment_1.default)().day();
// => 0 (Sunday)
(0, moment_1.default)().days(-14);
// => "2018-08-26T09:12:49.695Z"
(0, moment_1.default)().dayOfYear();
// => 252
(0, moment_1.default)().dayOfYear(256);
// => "2018-09-13T09:12:49.695Z"
(0, moment_1.default)().week();
// => 37
(0, moment_1.default)().weeks(24);
// => "2018-06-10T09:12:49.695Z"
(0, moment_1.default)('2012-02', 'YYYY-MM').daysInMonth();
// => 29
(0, moment_1.default)().isoWeeksInYear();
// => 52
const array = [
    new Date(2017, 4, 13),
    new Date(2018, 2, 12),
    new Date(2016, 0, 10),
    new Date(2016, 0, 9),
];
// Moment.js
moment_1.default.max(array.map((a) => (0, moment_1.default)(a)));
// => "2018-03-11T13:00:00.000Z"
// Moment.js
moment_1.default.min(array.map((a) => (0, moment_1.default)(a)));
// => "2016-01-08T13:00:00.000Z"
//------------------------------ Manipulate ------------------------------
(0, moment_1.default)().add(7, 'days'); //  TODO:
// => "2018-09-16T09:12:49.695Z"
(0, moment_1.default)().subtract(7, 'days');
// => "2018-09-02T09:12:49.695Z"
(0, moment_1.default)().startOf('month');
// => "2018-08-31T14:00:00.000Z"
(0, moment_1.default)().endOf('day');
// => "2018-09-09T13:59:59.999Z"
//------------------------------ Display ------------------------------
(0, moment_1.default)().format('dddd, MMMM Do YYYY, h:mm:ss A');
// => "Sunday, September 9th 2018, 7:12:49 PM"
(0, moment_1.default)().format('ddd, hA');
// => "Sun, 7PM"
(0, moment_1.default)(1536484369695).fromNow();
// => "4 days ago"
(0, moment_1.default)([2007, 0, 27]).to((0, moment_1.default)([2007, 0, 29]));
// => "in 2 days"
(0, moment_1.default)([2007, 0, 27]).diff((0, moment_1.default)([2007, 0, 29]));
// => -172800000
(0, moment_1.default)([2007, 0, 27]).diff((0, moment_1.default)([2007, 0, 29]), 'days'); // TODO:
// => -2
//------------------------------ Query ------------------------------
(0, moment_1.default)('2010-10-20').isBefore('2010-10-21');
// => true
(0, moment_1.default)('2010-10-20').isSame('2010-10-21');
// => false
(0, moment_1.default)('2010-10-20').isSame('2010-10-20');
// => true
(0, moment_1.default)('2010-10-20').isSame('2010-10-21', 'month');
// => true
(0, moment_1.default)('2010-10-20').isAfter('2010-10-19');
// => true
(0, moment_1.default)('2010-10-20').isBetween('2010-10-19', '2010-10-25');
// => true
(0, moment_1.default)([2000]).isLeapYear();
// => true
//------------------------------ Static method ------------------------------
moment_1.default.isDate(new Date()); // not work
moment_1.default.isMoment((0, moment_1.default)());
moment_1.default.min((0, moment_1.default)());
