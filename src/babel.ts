import generate from '@babel/generator';
import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { readFile, writeFile } from 'fs/promises';
import { babelConfig, methodTransform, staticTransform, structureEqual } from './config';

const transform = async (path) => {
  // const path = resolve(root, './example/1.you_dont_know_moment.ts');
  // const path = resolve(root, './example/3.use_tsx.tsx');
  // const path = resolve(root, './example/4.static.ts');

  const code = await readFile(path, { encoding: 'utf-8' });
  console.log(code);

  let ast;
  try {
    ast = parse(code, babelConfig);
  } catch (error) {
    console.log(`parse fail: ${path}`);
    return;
  }

  // get context
  const context = {
    hasImport: false,
    hasType: false,
    types: [],
    importName: 'moment',
    importTypeName: 'Moment',
    /** global import plugin  */
    plugin: [],
    /** global import locale */
    extendLocale: new Set(),
  };

  let importPath: NodePath<t.ImportDefaultSpecifier | t.VariableDeclarator>;
  let importTypePath: NodePath<t.ImportSpecifier | t.VariableDeclarator>;

  // get default import moment name, moment type and replace the value
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value === 'moment') {
        path.get('specifiers').forEach((p) => {
          if (p.isImportDefaultSpecifier()) {
            // import moment name
            context.importName = p.node.local.name;
            importPath = p;

            // replace type
            p.node.local.name = 'dayjs';
          } else if (
            structureEqual(p.node, { type: 'ImportSpecifier', imported: { name: 'Moment' } })
          ) {
            //get ts type name
            context.importTypeName = p.node.local.name;
            importTypePath = p as NodePath<t.ImportSpecifier>;

            // replace type
            (p.node as t.ImportSpecifier).imported['name'] = 'Dayjs';
          }
        });

        path.node.source.value = 'dayjs';
        // importPath && importTypePath && path.stop();
      } else if (path.node.source.value === 'dayjs') {
        // ensure has import dayjs?
        path.get('specifiers').forEach((p) => {
          if (p.isImportDefaultSpecifier()) {
            context.hasImport = true;
          } else if (
            structureEqual(p.node, {
              type: 'ImportSpecifier',
              imported: {
                name: 'Dayjs',
              },
            })
          ) {
            context.hasType = true;
          }
        });
      }
    },

    VariableDeclarator(path) {
      if (
        structureEqual(path.node.init, {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'require' },
          arguments: [{ value: 'moment' }],
        })
      ) {
        const patternNode = path.node.id;
        if (patternNode.type === 'Identifier') {
          context.importName = patternNode.name;

          patternNode.name = 'dayjs';
        } else if (patternNode.type === 'ObjectPattern') {
          const typeNode = patternNode.properties.find(
            (n) =>
              n.type === 'ObjectProperty' && n.key.type === 'Identifier' && n.key.name === 'Moment'
          ) as t.ObjectProperty;

          if (typeNode) {
            importPath = path;

            typeNode.key['name'] = 'Dayjs';
          }
        }

        path.node.init['arguments'][0].value = 'dayjs';
        // importPath && importTypePath && path.stop();
      }
    },
  });

  // ------------------------- replace static method --------------------------------------------
  importPath?.scope.bindings['moment']?.referencePaths.forEach((p) => {
    if (p.parent.type === 'MemberExpression') {
      // static method
      const conf = staticTransform[p.parent.property['name']];
      if (conf) {
        if (conf.plugin) {
          context.plugin.push(...conf.plugin);
        }
        if (conf.rename) {
          p.parent.property['name'] = conf.rename;
        }
      }
    }
  });

  traverse(ast, {
    // ------------------------- replace instance method --------------------------------------------
    MemberExpression: (path) => {
      const conf = methodTransform[path.node.property?.['name']];
      if (!conf) return;

      if (conf.transform) {
        conf.transform(path, context);
      }

      if (conf.plugin) {
        context.plugin.push(...conf.plugin);
      }
      if (conf.rename) {
        path.node.property['name'] = conf.rename;
      }
    },

    // ------------------------- replace `moment()` --------------------------------------------
    CallExpression: (path) => {
      if (structureEqual(path.node, { callee: { name: context.importName } })) {
        // transform array to ...string
        // TODO:
        // transform object to ...string
        // TODO:

        if (path.node.arguments.length > 1) {
          // has second argument -> moment('2022-1-1', 'YYYY-MM-DD HH:mm')
          context.plugin.push('customParseFormat');
        }
        if (path.node.arguments.length > 2 && path.node.arguments[2].type === 'StringLiteral') {
          // add locale plugin
          context.extendLocale.add(path.node.arguments[2].value);
        }
        // path.node.callee = t.identifier('dayjs');
      }
    },
  });

  // ------------------------- replace import and require --------------------------------------------

  // traverse(ast, {
  //   ImportDeclaration(path) {
  //     // import moment
  //     if (path.node.source.value === 'moment') {
  //       path.node.source.value = 'dayjs';
  //     }
  //     // import Moment
  //     const typeNode = path.node.specifiers.find(
  //       (n) => n.type === 'ImportSpecifier' && n.imported['name'] === 'Moment'
  //     ) as t.ImportSpecifier;
  //     if (typeNode) {
  //       typeNode.imported['name'] = 'Dayjs';
  //     }
  //   },

  //   // require
  //   VariableDeclarator(path) {
  //     if (
  //       structureEqual(path.get('init').node, {
  //         type: 'CallExpression',
  //         callee: { type: 'Identifier', name: 'require' },
  //         arguments: [{ value: 'moment' }],
  //       })
  //     ) {
  //       path.node.init['arguments'][0].value = 'dayjs';
  //     }
  //   },
  // });
  // ------------------------- replace moment --------------------------------------------
  // replace moment
  importPath?.scope.rename('moment', 'dayjs');
  if (context.hasImport) {
    importPath?.remove();
  }

  // ------------------------- replace Moment type --------------------------------------------
  // traverse(ast, {
  //   TSTypeReference(path) {
  //     if (path.node.typeName['name'] === 'Moment') {
  //       path.node.typeName['name'] = 'Dayjs';
  //     }
  //   },
  // });
  importTypePath?.scope.rename('Moment', 'Dayjs');
  if (context.hasType) {
    importTypePath?.remove();
  }

  // -----------------------------------------------------------------------------------------

  const output = generate(ast, {}, code);

  console.log(context);
  console.log('--------------------------');
  // console.log(output);

  await writeFile(path, output.code);
};

export default transform;
