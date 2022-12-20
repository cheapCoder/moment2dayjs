import { run } from 'jscodeshift/src/Runner';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

// for watch mode
import transform from '../src/transform';
// const a = transform;
console.log(transform);

const toString = (stats) =>
  Object.keys(stats).join('||||||||||||||||||||||||||||||||||||||||||||||||\n');

describe('`you don\t know moment` reference', () => {
  it.concurrent('parse', async () => {
    const transformPath = join(process.cwd(), './src/transform.js');

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

      //------------------------------ Parse ------------------------------

      // String + Date Format
      dayjs('12-25-1995', 'MM-DD-YYYY');

      // String + Time Format
      dayjs('2010-10-20 4:30', 'YYYY-MM-DD HH:mm');

      // String + Format + locale
      dayjs('2012 mars', 'YYYY MMM', 'fr');
      //------------------------------ Parse ------------------------------
      ||||||||||||||||||||||||||||||||||||||||||||||||
      customParseFormat---weekday---dayOfYear"
    `);
  });
});
