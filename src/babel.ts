import { parse, ParserOptions } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import generate from '@babel/generator';
import t from '@babel/types';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { staticTransform } from './config';

const root = process.cwd();

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
  importName: 'moment',
  importTypeName: undefined,
  /** global import plugin  */
  extendPlugins: [],
  /** global import locale */
  extendLocale: new Set(),
};

let momentPath: NodePath<t.ImportDefaultSpecifier>;

// get default import moment's name
traverse(ast, {
  ImportDefaultSpecifier(path) {
    if (path.parent['source']['value'] === 'moment') {
      context.importName = path.node.local.name;

      momentPath = path;
      path.stop();
    }
  },
});

if (!momentPath) process.exit();

// ------------------------- replace static method --------------------------------------------

momentPath.scope.rename("moment", 'mo')

console.log(momentPath.scope.bindings['moment']);

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

console.log(context);

const output = generate(ast);

 console.log(output);
