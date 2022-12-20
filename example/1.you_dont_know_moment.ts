import moment from 'moment';
import dayjs from 'dayjs';
import parse from 'date-fns/parse';

//------------------------------ Parse ------------------------------

// String + Date Format
moment('12-25-1995', 'MM-DD-YYYY');

// String + Time Format
moment('2010-10-20 4:30', 'YYYY-MM-DD HH:mm');

// String + Format + locale
moment('2012 mars', 'YYYY MMM', 'fr');
//------------------------------ Parse ------------------------------
