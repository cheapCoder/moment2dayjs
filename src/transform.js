// import { Transform } from "jscodeshift"
// const {Transform } = require("jscodeshift")

/** @type {import('jscodeshift').Transform} */
const transform = (file, { j, report, stats }, option) => {
  try {
    const root = j(file.source);

    // import for global
    const globalExtend = [];
    const pageImport = [];

    const isImported = {
      constructor: false,
      type: false,
    };

    // -------------------------[parse] replace `moment()`--------------------------------------------
    let defaultImportName = 'moment';
    root
      .find(j.ImportDeclaration, { source: { value: 'moment' } })
      ?.find(j.ImportDefaultSpecifier)
      .forEach((path) => {
        defaultImportName = path.node.local.name;
      });

    root.find(j.CallExpression, { callee: { name: defaultImportName } }).replaceWith((path) => {
      if (path.node.arguments.length > 1) {
        // has second argument -> moment('2022-1-1', 'YYYY-MM-DD HH:mm')
        globalExtend.push(`import customParseFormat from 'dayjs/plugin/customParseFormat';\n
        dayjs.extend(customParseFormat);`);
      }
      path.node.callee = j.identifier('dayjs');
      return path.node;
    });

    // ------------------------- replace locale --------------------------------------------

    // -------------------------[Get + Set] replace method --------------------------------------------

    // -------------------------[Manipulate] replace method --------------------------------------------

    // ------------------------- replace import and require --------------------------------------------
    // import moment from 'moment'
    // after  : import dayjs from 'dayjs
    root.find(j.ImportDeclaration, { source: { value: 'moment' } }).replaceWith((path) => {
      // replace to `import ... from dayjs`
      path.node.source = j.literal('dayjs');

      path.node.specifiers = path.node.specifiers.map((s) => {
        if (s.type === 'ImportDefaultSpecifier') {
          // replace moment constructor
          return j.importDefaultSpecifier(j.identifier('dayjs'));
        } else if (s.type === 'ImportSpecifier' && s.imported.name === 'Moment') {
          // replace Moment type
          return j.importSpecifier(j.identifier('Dayjs'));
        }
      });

      return path.node;
    });

    // before : const moment = require('moment')
    // after  : const dayjs = require('dayjs')
    root
      .find(j.VariableDeclaration)
      .filter((path) => {
        const d = path?.node?.declarations?.[0];
        return d?.init?.callee?.name === 'require' && d?.id?.name === 'moment';
      })
      .replaceWith(() => {
        return j.importDeclaration.from({
          source: j.literal('dayjs'),
          specifiers: [j.importDefaultSpecifier(j.identifier('dayjs'))],
        });
      });

    // -----------------------------------------------------------------------------------------

    // ------------------------- replace Moment type --------------------------------------------
    // get Type name  from `import` or `import type`
    let typeName = 'Moment';
    root
      .find(j.ImportDeclaration, { source: { value: 'moment' } })
      ?.find(j.ImportDefaultSpecifier)
      .forEach((path) => {
        defaultImportName = path.node.local.name;
      });

    root.find(j.TSTypeParameterInstantiation);

    // root
    //   .find(j.TSTypeReference, {
    //     typeName: { name: 'Moment' },
    //   })
    //   .replaceWith(() => j.tsTypeReference(j.identifier('Dayjs')))
    //   .toSource();

    root
      .find(j.TSTypeReference, {
        typeName: { name: 'Moment' },
      })
      .replaceWith(() => j.tsTypeReference(j.identifier('Dayjs')));
    // -----------------------------------------------------------------------------------------

    const res = root.toSource();
    stats(res);

    stats(globalExtend);

    return res;
  } catch (error) {
    stats(error.message);
  }
};

module.exports = transform;

module.exports.parser = 'tsx';
