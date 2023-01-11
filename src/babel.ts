import { parse, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { staticTransform } from './config';

const root = process.cwd();

// const path = resolve(root, './example/3.use_tsx.tsx');
// const path = resolve(root, './example/4.static.ts');
const path = resolve(root, './example/3.use_tsx.tsx');

const code = readFileSync(path, { encoding: 'utf-8' });
// console.log(code);

const option: ParserOptions = {
  sourceType: 'module',
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  startLine: 1,
  tokens: true,
  plugins: [
    'jsx',
    'asyncGenerators',
    'bigInt',
    'classPrivateMethods',
    'classPrivateProperties',
    'classProperties',
    'decorators-legacy',
    'doExpressions',
    'dynamicImport',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'functionBind',
    'functionSent',
    'importMeta',
    'nullishCoalescingOperator',
    'numericSeparator',
    'objectRestSpread',
    'optionalCatchBinding',
    'optionalChaining',
    ['pipelineOperator', { proposal: 'minimal' }],
    'throwExpressions',
    'typescript',
  ],
};

let ast;
try {
  ast = parse(code, option);
} catch (error) {
  console.log(`parse fail: ${path}`);
}

// get context
const context = {
  types: [],
  importName: 'moment',
  importTypeName: undefined,
  /** global import plugin  */
  plugin: [],
  /** global import locale */
  extendLocale: new Set(),
};

let momentPath: NodePath<t.ImportDefaultSpecifier | t.VariableDeclarator>;

// get default import moment's name
traverse(ast, {
  ImportDefaultSpecifier(path) {
    if (path.parent['source']['value'] === 'moment') {
      context.importName = path.node.local.name;
      momentPath = path;
      path.stop();
    }
  },
  VariableDeclarator(path) {
    console.log(
      t.shallowEqual(path.node, {
        type: 'VariableDeclarator',

        id: { type: 'Identifier' },
        // init: {
        // type: 'CallExpression',
        // callee: { type: 'Identifier', name: 'require' },
        // arguments: [{ type: 'Literal', value: 'moment' }],
        // },
      })
    );

    if (
      t.shallowEqual(path.node, {
        id: { type: 'Identifier' },
        init: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'require' },
          arguments: [{ type: 'Literal', value: 'moment' }],
        },
      })
    ) {
      context.importName = path.node.id['name'];
      momentPath = path;
      path.stop();
    }
  },
});

// if (!momentPath) process.exit();

// ------------------------- replace static method --------------------------------------------

const instancePathList = [];
momentPath.scope.bindings['moment'].referencePaths.forEach((p) => {
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
  } else if (p.parent.type === 'CallExpression') {
    // record all instance
    // instancePathList.push()
    // instance method
  }
});

// staticTransform.forEach((conf) => {
//   root
//     .find(
//       j.CallExpression,
//       (node) =>
//         node.callee.type === 'MemberExpression' &&
//         node.callee.object.type === 'Identifier' &&
//         node.callee.object.name === context.importName &&
//         node.callee.property.type === 'Identifier' &&
//         conf.name.test(node.callee.property.name)
//     )
//     .replaceWith((path) => {
//       if (conf.plugin) {
//         context.extendPlugins.push(...conf.plugin);
//       }
//       if (conf.rename) {
//         path.node.callee['property'] = j.identifier(conf.rename);
//       }
//       path.node.callee['object'] = j.identifier('dayjs');
//       return path.node;
//     });
// });

// ------------------------- replace Moment type --------------------------------------------
// get Type name  from `import` or `import type`
// let typeName = 'Moment';
// root
//   .find(j.ImportDeclaration, { source: { value: 'moment' } })
//   ?.find(j.ImportDefaultSpecifier)
//   .forEach((path) => {
//     context.importName = path.node.local.name;
//   });

traverse(ast, {
  TSTypeReference(path) {
    if (path.node.typeName['name'] === 'Moment') {
      path.node.typeName['name'] = 'Dayjs';

      // replace import type
      // traverse(path.node,{ImportSpecifier(path) {

      // }})
    }
  },
});

// -----------------------------------------------------------------------------------------

momentPath.scope.rename('moment', 'dayjs');

const output = generate(ast);

console.log(context);
console.log('--------------------------');
console.log(output);
