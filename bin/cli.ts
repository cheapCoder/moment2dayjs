#!/usr/bin/env node

const { run: jscodeshift } = require('jscodeshift/src/Runner');
const { existsSync } = require('node:fs');
const { resolve } = require('node:path');
const glo = require('../src/global');

function getEntry() {
  const projectRoot = process.cwd();
  try {
    const packageJson = require(resolve(projectRoot, 'package.json'));
    if (packageJson.main) {
      const path = resolve(projectRoot, packageJson.main);
      if (existsSync(path)) {
        return path;
      }
    }
  } catch (error) {
    console.error('no package.json entry');
  }

  const ext = ['.js', '.ts', '.jsx', '.tsx'];
  const filenames = ['index', 'main', 'app'];

  for (let i = 0; i < filenames.length; i++) {
    for (let j = 0; j < ext.length; j++) {
      const path = resolve(projectRoot, 'src', filenames[i] + ext[j]);
      if (existsSync(path)) {
        return path;
      }
    }
  }
}

async function run() {
  const transformPath = resolve(__dirname, '../out/transform.js');
  const paths = [resolve(process.cwd(), 'src')];
  const options = {
    // dry: true,
    // print: true,
    // verbose: 1,
    // ...
  };
  const res = await jscodeshift(transformPath, paths, options);

  console.log('global---------------------');

  console.log(glo);

  console.log(res);

  const entry = getEntry();

  console.log(entry);

  if (entry) {
    jscodeshift(resolve(__dirname, '../out/entryTransform.js'), [entry], {});
  }
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

// console.log(getEntry());

run();
