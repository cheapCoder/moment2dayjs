// @ts-nocheck

import moment, { Moment } from 'moment';
import momentGenerateConfig from 'rc-picker/lib/generate/moment';
import generateCalendar, { CalendarProps } from './generateCalendar';

let a: Moment = moment();
// FIXME:
const Calendar = generateCalendar<Moment>(momentGenerateConfig);

export { CalendarProps };
export default Calendar;
