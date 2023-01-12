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

// ------------------------- replace instance method --------------------------------------------
// methodTransform.forEach((conf) => {
//   root
//     .find(j.CallExpression, (node) => conf.name.test(node.callee?.property?.name))
//     .replaceWith((path) => {
//       if (conf.transform) {
//         path = conf.transform(path, context, { stats, report });
//       }
//       if (conf.plugin) {
//         context.extendPlugins.push(...conf.plugin);
//       }
//       if (conf.rename) {
//         path.node.callee.property = j.identifier(conf.rename);
//       }

//       return path.node;
//     });
// });

// ------------------------- replace `moment()` --------------------------------------------
// if (context.importName) {
//   // `moment()`
//   root.find(j.CallExpression, { callee: { name: context.importName } }).replaceWith((path) => {
//     // transform array to ...string
//     // TODO:
//     // transform object to ...string
//     // TODO:

//     if (path.node.arguments.length > 1) {
//       // has second argument -> moment('2022-1-1', 'YYYY-MM-DD HH:mm')
//       context.extendPlugins.push('customParseFormat');
//     }
//     if (path.node.arguments.length > 2 && path.node.arguments[2].type === 'StringLiteral') {
//       // add locale plugin
//       context.extendLocale.add(path.node.arguments[2].value);
//     }
//     path.node.callee = j.identifier('dayjs');
//     return path.node;
//   });

//   // `moment.xxx`
//   // root
//   //   .find(j.CallExpression, {
//   //     callee: { type: 'MemberExpression', object: { name: context.importName } },
//   //   })
//   //   .replaceWith((path) => {
//   //     path.node.callee.object = j.identifier('dayjs');
//   //     return path.node;
//   //   });
// }

// ------------------------- replace import and require --------------------------------------------
traverse(ast, {
  // import
  ImportDeclaration(path) {
    if (path.node.source.value === 'moment') {
      path.node.source.value = 'Dayjs';

      path.node.specifiers?.forEach((s) => {
        if (s.type === 'ImportDefaultSpecifier') {
          // replace moment constructor
          s.local.name = 'dayjs';
        } else if (s.type === 'ImportSpecifier' && s.imported['name'] === 'Moment') {
          // replace Moment type
          s.imported['name'] = 'Dayjs';
        }
      });
    }
  },

  VariableDeclaration(path) {
    
  },
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

// ------------------------- replace Moment type --------------------------------------------

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
