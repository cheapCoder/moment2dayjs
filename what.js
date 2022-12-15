const { run: jscodeshift } = require('jscodeshift/src/Runner');
const path = require('node:path');

async function what() {
  const transformPath = path.resolve('./transform.js');
  const paths = ['./example/2.use_jsx.jsx', './example/3.test.ts'];
  const options = {
    dry: true,
    print: true,
    verbose: 1,
    // ...
  };
console.log(transformPath, paths);
  const res = await jscodeshift(transformPath, paths, options);
  console.log('----------------------------');
  console.log(res);
  /*
{
  stats: {},
  timeElapsed: '0.001',
  error: 0,
  ok: 0,
  nochange: 0,
  skip: 0
}
*/
}
what();
