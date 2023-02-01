import { Transform } from 'jscodeshift';
import * as t from 'jscodeshift';

const transform: Transform = (file, { j, report, stats }, { plugins = [] }) => {
  try {
    const root = j(file.source);

    let hasImportDayjs = false;

    // import
    let importPaths: t.Collection<t.ImportDeclaration | t.VariableDeclarator> = root.find(
      j.ImportDeclaration
    );
    if (importPaths.length) {
      importPaths.forEach((p: t.ASTPath<t.ImportDeclaration>, i, paths) => {
        if (
          p.node.source.value === 'dayjs' &&
          p.node.specifiers.some((n) => n.type === 'ImportDefaultSpecifier')
        ) {
          hasImportDayjs = true;
        }
        if (i === paths.length - 1) {
          p.insertAfter(
            (hasImportDayjs ? '' : 'import dayjs from "dayjs";\n') +
              plugins.map((name) => `import ${name} from 'dayjs/plugin/${name}';`).join('\n') +
              '\n\n' +
              plugins.map((name) => `dayjs.extend(${name});`).join('\n')
          );
        }
      });
    } else {
      // require
      importPaths = root.find(j.VariableDeclarator, {
        init: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'require',
          },
        },
      });
      if (importPaths.length) {
        importPaths.forEach((p: t.ASTPath<t.VariableDeclarator>, i, paths) => {
          if (
            p.node.id.type === 'Identifier' &&
            p.node.init['arguments']?.length === 1 &&
            p.node['arguments'][0]['value'] === 'dayjs'
          ) {
            hasImportDayjs = true;
          }
          if (i === paths.length - 1) {
            p.insertAfter(
              (hasImportDayjs ? '' : 'const dayjs = require("dayjs");\n') +
                plugins
                  .map((name) => `const ${name} = require('dayjs/plugin/${name}');`)
                  .join('\n') +
                '\n\n' +
                plugins.map((name) => `dayjs.extend(${name});`).join('\n')
            );
          }
        });
      }
    }

    return root.toSource();
  } catch (error) {
    report(error.message);
  }
};

export default transform;
