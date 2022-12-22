import { Transform } from 'jscodeshift';

import { methodTransform, staticTransform } from './config';

const transform: Transform = (file, { j, report, stats }, option) => {
  try {
    const root = j(file.source);

    // get context
    const context = {
      importName: undefined,
      /** global import plugin  */
      extendPlugins: [],
      /** global import locale */
      extendLocale: new Set(),
    };
    // get default import moment's name
    root
      .find(j.ImportDeclaration, { source: { value: 'moment' } })
      ?.find(j.ImportDefaultSpecifier)
      .forEach((path) => {
        context.importName = path.node.local.name;
      });

    // ------------------------- replace static method --------------------------------------------
    staticTransform.forEach((conf) => {
      root
        .find(
          j.CallExpression,
          (node) =>
            node.callee.type === 'MemberExpression' &&
            node.callee.object.type === 'Identifier' &&
            node.callee.object.name === context.importName &&
            node.callee.property.type === 'Identifier' &&
            conf.name.test(node.callee.property.name)
        )
        .replaceWith((path) => {
          if (conf.plugin) {
            context.extendPlugins.push(...conf.plugin);
          }
          if (conf.rename) {
            path.node.callee['property'] = j.identifier(conf.rename);
          }
          path.node.callee['object'] = j.identifier('dayjs');
          return path.node;
        });
    });

    // ------------------------- replace instance method --------------------------------------------
    methodTransform.forEach((conf) => {
      root
        .find(j.CallExpression, (node) => conf.name.test(node.callee?.property?.name))
        .replaceWith((path) => {
          // if (conf.transform) {
          //   path = conf.transform(path, context);
          // }
          if (conf.plugin) {
            context.extendPlugins.push(...conf.plugin);
          }
          if (conf.rename) {
            path.node.callee.property = j.identifier(conf.rename);
          }

          return path.node;
        });
    });

    // ------------------------- replace `moment()` --------------------------------------------
    if (context.importName) {
      // `moment()`
      root.find(j.CallExpression, { callee: { name: context.importName } }).replaceWith((path) => {
        // transform array to ...string
        // TODO:
        // transform object to ...string
        // TODO:

        if (path.node.arguments.length > 1) {
          // has second argument -> moment('2022-1-1', 'YYYY-MM-DD HH:mm')
          context.extendPlugins.push('customParseFormat');
        }
        if (path.node.arguments.length > 2 && path.node.arguments[2].type === 'StringLiteral') {
          // add locale plugin
          context.extendLocale.add(path.node.arguments[2].value);
        }
        path.node.callee = j.identifier('dayjs');
        return path.node;
      });

      // `moment.xxx`
      // root
      //   .find(j.CallExpression, {
      //     callee: { type: 'MemberExpression', object: { name: context.importName } },
      //   })
      //   .replaceWith((path) => {
      //     path.node.callee.object = j.identifier('dayjs');
      //     return path.node;
      //   });
    }

    // ------------------------- replace import and require --------------------------------------------
    // import
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

    // require
    root
      .find(j.VariableDeclaration, {
        type: 'VariableDeclaration',
        declarations: [
          {
            init: {
              type: 'CallExpression',
              callee: { type: 'Identifier', name: 'require' },
              arguments: [{ value: 'moment' }],
            },
          },
        ],
      })
      .replaceWith((path) => {
        if (path.node.declarations?.[0]['init'].arguments[0]) {
          path.node.declarations[0]['init'].arguments[0] = j.stringLiteral('dayjs');
        }
        return path.node;
      });

    // -----------------------------------------------------------------------------------------

    // ------------------------- replace Moment type --------------------------------------------
    // get Type name  from `import` or `import type`
    // let typeName = 'Moment';
    // root
    //   .find(j.ImportDeclaration, { source: { value: 'moment' } })
    //   ?.find(j.ImportDefaultSpecifier)
    //   .forEach((path) => {
    //     context.importName = path.node.local.name;
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

    const plugins = [...new Set(context.extendPlugins)];
    const globalImport =
      plugins.map((name) => `import ${name} from 'dayjs/plugin/${name}';`).join('\n') +
      '\n\n' +
      plugins.map((name) => `dayjs.extend(${name})`).join('\n') +
      '\n';

    stats(plugins.join('\n'));
    // stats(process.cwd());
    return res;
  } catch (error) {
    stats(error.message);
  }
};

export default transform;

export const parser = 'tsx';
