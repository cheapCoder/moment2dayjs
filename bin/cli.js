#!/usr/bin/env node

const glob = require('glob');
const { default: transform } = require('../lib/babel.js');
console.log(transform);
async function run() {
  const root = process.cwd();
  const files = glob.sync(`${root}/**/*.{ts,tsx,js,jsx}`, {
    // ignore test
    ignore: ['**/*test*/', '**/node_modules/**'],
  });

  console.log(files);

  await Promise.all(files.map(transform));
}

try {
  run();
} catch (error) {
  console.log(error);
}
