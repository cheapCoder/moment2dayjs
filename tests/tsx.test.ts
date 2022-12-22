import { run } from 'jscodeshift/src/Runner';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

// for watch mode
import transform from '../src/transform';
// const a = transform;
console.log(transform);

import * as w from '../example/1.you_dont_know_moment';
console.log(w);

const toString = (stats) => Object.keys(stats).join('\n\n');

describe('`you don\t know moment` reference', () => {
  it.concurrent('parse', async () => {
    const transformPath = join(process.cwd(), './out/transform.js');

    const paths = [join(process.cwd(), './example/1.you_dont_know_moment.ts')];
    const options = {
      dry: true,
      // print: true,
      // verbose: 1,
    };

    const res = await run(transformPath, paths, options);
    expect(toString(res.stats)).toMatchInlineSnapshot(`
      "import dayjs from 'dayjs';
      import parse from 'date-fns/parse';

      const mmm = require(\\"dayjs\\");
      //------------------------------ Parse ------------------------------

      // String + Date Format
      dayjs('12-25-1995', 'MM-DD-YYYY');
      // => \\"1995-12-24T13:00:00.000Z\\"

      // String + Time Format
      dayjs('2010-10-20 4:30', 'YYYY-MM-DD HH:mm');
      // => \\"2010-

      // String + Format + locale
      dayjs('2012 mars', 'YYYY MMM', 'fr');
      // => \\"2012-02-29T13:00:00.000Z\\"

      //------------------------------ Get + Set ------------------------------
      dayjs().second();
      // => 49
      dayjs().hour();
      // => 19

      dayjs().second(30);
      // => \\"2018-09-09T09:12:30.695Z\\"
      dayjs().hour(13);
      // => \\"2018-09-09T03:12:49.695Z\\"

      dayjs().date();
      // => 9
      dayjs().date(4);
      // => \\"2018-09-04T09:12:49.695Z\\"

      dayjs().day();
      // => 0 (Sunday)
      dayjs().day(-14);
      // => \\"2018-08-26T09:12:49.695Z\\"

      dayjs().dayOfYear();
      // => 252
      dayjs().dayOfYear(256);
      // => \\"2018-09-13T09:12:49.695Z\\"

      dayjs().week();
      // => 37
      dayjs().week(24);
      // => \\"2018-06-10T09:12:49.695Z\\"

      dayjs('2012-02', 'YYYY-MM').daysInMonth();
      // => 29

      dayjs().isoWeeksInYear();
      // => 52

      const array = [
        new Date(2017, 4, 13),
        new Date(2018, 2, 12),
        new Date(2016, 0, 10),
        new Date(2016, 0, 9),
      ];
      // Moment.js
      dayjs.max(array.map((a) => dayjs(a)));
      // => \\"2018-03-11T13:00:00.000Z\\"

      // Moment.js
      dayjs.min(array.map((a) => dayjs(a)));
      // => \\"2016-01-08T13:00:00.000Z\\"

      //------------------------------ Manipulate ------------------------------
      dayjs().add(7, 'days'); //  TODO:
      // => \\"2018-09-16T09:12:49.695Z\\"

      dayjs().subtract(7, 'days');
      // => \\"2018-09-02T09:12:49.695Z\\"

      dayjs().startOf('month');
      // => \\"2018-08-31T14:00:00.000Z\\"

      dayjs().endOf('day');
      // => \\"2018-09-09T13:59:59.999Z\\"

      //------------------------------ Display ------------------------------
      dayjs().format('dddd, MMMM Do YYYY, h:mm:ss A');
      // => \\"Sunday, September 9th 2018, 7:12:49 PM\\"
      dayjs().format('ddd, hA');
      // => \\"Sun, 7PM\\"

      dayjs(1536484369695).fromNow();
      // => \\"4 days ago\\"

      dayjs([2007, 0, 27]).to(dayjs([2007, 0, 29]));
      // => \\"in 2 days\\"

      dayjs([2007, 0, 27]).diff(dayjs([2007, 0, 29]));
      // => -172800000
      dayjs([2007, 0, 27]).diff(dayjs([2007, 0, 29]), 'days'); // TODO:
      // => -2

      //------------------------------ Query ------------------------------
      dayjs('2010-10-20').isBefore('2010-10-21');
      // => true

      dayjs('2010-10-20').isSame('2010-10-21');
      // => false
      dayjs('2010-10-20').isSame('2010-10-20');
      // => true
      dayjs('2010-10-20').isSame('2010-10-21', 'month');
      // => true

      dayjs('2010-10-20').isAfter('2010-10-19');
      // => true

      dayjs('2010-10-20').isBetween('2010-10-19', '2010-10-25');
      // => true

      dayjs([2000]).isLeapYear();
      // => true

      //------------------------------ Static method ------------------------------
      moment.isDate(new Date()); // not work

      dayjs.isDayjs(dayjs());

      dayjs.min(dayjs());


      minMax
      dayOfYear
      weekOfYear
      isoWeeksInYear
      isLeapYear
      relativeTime
      isBetween
      customParseFormat"
    `);
  });
});
