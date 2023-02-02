#!/usr/bin/env node

const { run: jscodeshift } = require('jscodeshift/src/Runner');
const { existsSync } = require('node:fs');
const { resolve } = require('node:path');
const chalk = require('chalk');

function getEntry() {
  const projectRoot = process.cwd();
  // try {
  //   const packageJson = require(resolve(projectRoot, 'package.json'));
  //   if (packageJson.main) {
  //     const path = resolve(projectRoot, packageJson.main);
  //     if (existsSync(path)) {
  //       return path;
  //     }
  //   }
  // } catch (error) {
  //   console.error('no package.json entry');
  // }

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
  const root = process.cwd();
  const transformPath = resolve(__dirname, '../lib/transform.js');

  const paths = [process.cwd()];
  const options = {
    dry: true,
    print: false,
    verbose: 2,
    extensions: 'js,jsx,ts,tsx',
    ignorePattern: 'node_modules',
    // ignoreConfig: [resolve(root, '.gitignore')],
  };
  const res = await jscodeshift(transformPath, paths, options);

  console.log(res);

  const plugins = Object.keys(res.stats).join('|').split('|');
  if (!plugins.length) return;

  const entry = getEntry();

  console.log(entry);

  if (entry) {
    jscodeshift(resolve(__dirname, '../lib/entryTransform.js'), [entry], {
      dry: false,
      plugins,
      verbose: 2,
      print: true,
    });
  } else {
    console.log(
      chalk.bgRed('not found entry file, the plugins need inject yourself:\n' + plugins.join(', '))
    );
  }
}

// console.log(getEntry());

run();
