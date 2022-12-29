import { run } from 'jscodeshift/src/Runner';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import global from '../src/global';

// for watch mode
import transform from '../src/transform';
console.log(transform);

const toString = (stats) => Object.keys(stats).join('\n\n');

describe('fix project use', () => {
  it.concurrent('parse', async () => {
    const transformPath = join(process.cwd(), './out/transform.js');

    const paths = [join(process.cwd(), './example/4.basic.js')];
    const options = {
      dry: true,
      print: true,
      verbose: 1,
    };

    console.log(globalThis['plugins']);

    const res = await run(transformPath, paths, options);
    expect(toString(res.stats)).toMatchInlineSnapshot();
  });
});
