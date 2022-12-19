import { describe, it, expect } from 'vitest';
import { run } from 'jscodeshift/src/Runner';
import { join } from 'path';

// for watch mode
import transform from '../src/transform';
// const a = transform;
console.log(transform);

describe('suite', () => {
  it.concurrent('work in .tsx file', async () => {
    const transformPath = join(process.cwd(), './src/transform.js');

    const paths = [join(process.cwd(), './example/3.use_tsx.tsx')];
    const options = {
      dry: true,
      // print: true,
      // verbose: 1,
    };

    const res = await run(transformPath, paths, options);
    expect(Object.keys(res.stats)).toMatchInlineSnapshot(`
      [
        "import dayjs, { Dayjs } from \\"dayjs\\";
      import type { Dayjs } from \\"dayjs\\";
      import React, { useEffect, useState } from 'react';

      const mo = require('moment');

      console.log(dayjs() as Dayjs);
      console.log(dayjs() as What);

      const a: Dayjs = dayjs('123');
      console.log(a.unix());

      const [m, setMoment] = useState<Moment>(dayjs());

      /*对antd的Select进行封装，使得Select选择框的宽度自动跟随下拉菜单的宽度*/
      const AutoWidthSelect = function (props: { time: Dayjs }) {
        const [m, setMoment] = useState<Moment | null>(null);

        useEffect(() => {
          setMoment(dayjs() as Dayjs);
        }, []);

        return (
          <>
            <div>123123</div>
            <span>what</span>
            <h1>h11111</h1>

            {m?.date()}
          </>
        );
      };

      class Compone extends React.Component<{ m: Dayjs }> {}

      export default AutoWidthSelect;
      ",
        "",
      ]
    `);
  });
});
