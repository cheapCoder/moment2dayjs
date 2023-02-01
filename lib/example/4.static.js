"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs = require("dayjs");
require("dayjs/locale/zh-cn");
require("dayjs/locale/zh-cn");
dayjs.locale('zh-cn');
const { Dayjs } = require("dayjs");
var duration = dayjs.duration({ days: 1 });
var a = dayjs.utc([2011, 0, 1, 8]);
dayjs.parseZone('2016-05-03T22:15:01+02:00').local().format();
dayjs.isDayjs(new Date()); // false
dayjs.isDate(new Date()); // true
dayjs.locale('');
dayjs.month();
dayjs.monthsShort();
dayjs.weekdays();
dayjs.weekdaysShort();
dayjs.weekdaysMin();
dayjs.unix(132123123);
dayjs.max();
dayjs.min;
