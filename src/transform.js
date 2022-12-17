// import { Transform } from "jscodeshift"
// const {Transform } = require("jscodeshift")

/** @type {import('jscodeshift').Transform} */
const transform = (file, { j, report, stats }, option) => {
  // api.report('what is it')
  // api.stats('liheng', 123123)
  const root = j(file.source);

  const globalExtend = [];
  const pageImport = [];

  // const isImported  = {
  //   constructor: false,
  //   type: false,
  // }

  // ------------------------- replace import and require --------------------------------------------
  // before : import moment from 'moment'
  // after  : import dayjs from 'dayjs
  root
    .find(j.ImportDeclaration, {
      source: {
        value: 'moment',
      },
    })
    .replaceWith(() => {
      return j.importDeclaration.from({
        source: j.literal('dayjs'),
        specifiers: [j.importDefaultSpecifier(j.identifier('dayjs'))],
      });
    });

  // before : const moment = require('moment')
  // after  : const dayjs = require('dayjs')
  // root
  //   .find(j.VariableDeclaration)
  //   .filter((path) => {
  //     const d = path?.node?.declarations?.[0];
  //     return d?.init?.callee?.name === 'require' && d?.id?.name === 'moment';
  //   })
  //   .replaceWith(() => {
  //     return j.importDeclaration.from({
  //       source: j.literal('dayjs'),
  //       specifiers: [j.importDefaultSpecifier(j.identifier('dayjs'))],
  //     });
  //   });

  // -----------------------------------------------------------------------------------------

  // const res = root
  //   .find(j.TSTypeReference)
  //   .filter(
  //     (path) => path.node.typeName.type === 'Identifier' && path.node.typeName.name === 'Moment'
  //   )
  //   .replaceWith(() => j.tsTypeReference(j.identifier('Dayjs')))
  //   .toSource();

  stats(res);

  return res;
};

module.exports = transform;

module.exports.parser = 'tsx';
