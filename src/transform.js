// import { Transform } from "jscodeshift"
// const {Transform } = require("jscodeshift")

/** @type {import('jscodeshift').Transform} */
const transform = (file, { j, report, stats }, option) => {
  try {
    const transformFuncCallName = (from, to) =>
      root
        .find(j.CallExpression, {
          callee: { type: 'MemberExpression', property: { name: from } },
        })
        .replaceWith((path) => {
          path.node.callee.property = j.identifier(to);
          return path.node;
        });

    const root = j(file.source);

    /** @type{Set<string>} global import plugin  */
    let extendPlugins = new Set();

    /** @type{Set<string>} global import locale */
    let extendLocale = new Set();

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
        extendPlugins.add('customParseFormat');
      }
      if (path.node.arguments.length > 2 && path.node.arguments[2].type === 'StringLiteral') {
        // add locale plugin
        extendLocale.add(path.node.arguments[2].value);
      }
      path.node.callee = j.identifier('dayjs');
      return path.node;
    });

    // ------------------------- replace method --------------------------------------------
    const transMethods = ['milliseconds', 'seconds', 'minutes', 'hours', 'dates', 'days', 'weeks'];
    transMethods.forEach((name) => transformFuncCallName(name, name.substring(0, name.length - 1)));

    // `weekday` need extend plugin
    const weekdayTime = root
      .find(j.CallExpression, {
        callee: { type: 'MemberExpression', property: { name: 'weekday' } },
      })
      .size();
    extendPlugins.add('weekday');

    // `dayOfYear` need extend plugin
    const dayOfYearTime = root
      .find(j.CallExpression, {
        callee: { type: 'MemberExpression', property: { name: 'weekday' } },
      })
      .size();
    extendPlugins.add('dayOfYear');

    // stats(weekdayTime);
    // stats(dayOfYearTime);

    // -------------------------[Manipulate] replace method --------------------------------------------

    // ------------------------- replace import and require --------------------------------------------
    // import moment from 'moment'
    // after  : import dayjs from 'dayjs
    const hasImportDayjs = root.find(j.ImportDeclaration, { source: { value: 'dayjs' } }).size();

    root.find(j.ImportDeclaration, { source: { value: 'moment' } }).replaceWith((path) => {
      // replace to `import ... from dayjs`
      path.node.source = j.literal('dayjs');

      path.node.specifiers = path.node.specifiers?.map((s) => {
        if (s.type === 'ImportDefaultSpecifier') {
          // replace moment constructor
          return j.importDefaultSpecifier(j.identifier('dayjs'));
        } else if (s.type === 'ImportSpecifier' && s.imported.name === 'Moment') {
          // replace Moment type
          return j.importSpecifier(j.identifier('Dayjs'));
        }
      });

      return hasImportDayjs ? '' : path.node;
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
    // let typeName = 'Moment';
    // root
    //   .find(j.ImportDeclaration, { source: { value: 'moment' } })
    //   ?.find(j.ImportDefaultSpecifier)
    //   .forEach((path) => {
    //     defaultImportName = path.node.local.name;
    //   });

    root
      .find(j.TSTypeReference, {
        typeName: { name: 'Moment' },
      })
      .replaceWith(() => j.tsTypeReference(j.identifier('Dayjs')));

    // // type
    // root
    //   .find(j.TSTypeReference, (value) =>
    //     [value.typeName?.name || value.typeName?.right.name].some((name) =>
    //       ['Moment', 'MomentInput'].includes(name)
    //     )
    //   )
    //   .replaceWith(() => {
    //     return j.tsTypeReference.from({
    //       typeName: j.tsQualifiedName.from({
    //         left: j.identifier('dayjs'),
    //         right: j.identifier('Dayjs'),
    //       }),
    //     });
    //   });
    // -----------------------------------------------------------------------------------------

    const res = root.toSource();
    stats(res);

    stats([...extendPlugins].join('---'));

    return res;
  } catch (error) {
    stats(error.message);
  }
};

module.exports = transform;

module.exports.parser = 'tsx';
