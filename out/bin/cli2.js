#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { run: jscodeshift } = require('jscodeshift/src/Runner');
const { existsSync } = require('node:fs');
const { resolve } = require('node:path');
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
    }
    catch (error) {
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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const transformPath = resolve(__dirname, '../out/src/transform.js');
        const paths = [resolve(process.cwd(), 'src')];
        const options = {
            dry: false,
            // print: true,
            // verbose: 1,
            // ...
        };
        const res = yield jscodeshift(transformPath, paths, options);
        console.log(res);
        // const entry = getEntry();
        // console.log(entry);
        // if (entry) {
        //   jscodeshift(resolve(__dirname, '../out/src/entryTransform.js'), [entry], {});
        // }
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
    });
}
// console.log(getEntry());
run();
