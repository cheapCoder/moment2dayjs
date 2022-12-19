import { run } from 'jscodeshift/src/Runner';
import { join } from 'path';
import { describe, expect, it } from 'vitest';

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
        "Assignment to constant variable.",
      ]
    `);
  });
});
