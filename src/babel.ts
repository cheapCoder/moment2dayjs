import generate from '@babel/generator';
import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { babelConfig, staticTransform, structureEqual } from './config';

const root = process.cwd();

// const path = resolve(root, './example/3.use_tsx.tsx');
// const path = resolve(root, './example/4.static.ts');
const path = resolve(root, './example/3.use_tsx.tsx');

const code = readFileSync(path, { encoding: 'utf-8' });
// console.log(code);

let ast;
try {
  ast = parse(code, babelConfig);
} catch (error) {
  console.log(`parse fail: ${path}`);
}

// get context
const context = {
  types: [],
  // importName: 'moment',
  // importTypeName: 'Moment',
  /** global import plugin  */
  plugin: [],
  /** global import locale */
  extendLocale: new Set(),
};

let importPath: NodePath<t.ImportDefaultSpecifier | t.VariableDeclarator>;
let importTypePath: NodePath<t.ImportSpecifier | t.VariableDeclarator>;

// get default import moment's name
traverse(ast, {
  ImportDeclaration(path) {
    if (path.node.source.value === 'moment') {
      path.get('specifiers').forEach((p) => {
        if (p.isImportDefaultSpecifier()) {
          // import moment name
          // context.importName = p.node.local.name;
          importPath = p;
        } else if (
          structureEqual(p.node, { type: 'ImportSpecifier', imported: { name: 'Moment' } })
        ) {
          // ts type name
          // context.importTypeName = p.node.local.name;
          importTypePath = p as NodePath<t.ImportSpecifier>;
        }
      });

      importPath && importTypePath && path.stop();
    }
  },

  // VariableDeclarator(path) {
  //   if (
  //     structureEqual(path.node, {
  //       init: {
  //         type: 'CallExpression',
  //         callee: { type: 'Identifier', name: 'require' },
  //         arguments: [{ value: 'moment' }],
  //       },
  //     })
  //   ) {
  //     // context.importName = path.node.id['name'];
  //     importPath = path;
  //     path.stop();
  //   }
  // },
});

// ------------------------- replace static method --------------------------------------------
const instancePathList = [];
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
// replace moment constructor
importPath?.scope.rename('moment', 'dayjs');

// ------------------------- replace import and require --------------------------------------------

traverse(ast, {
  // import
  ImportDeclaration(path) {
    if (path.node.source.value === 'moment') {
      path.node.source.value = 'Dayjs';
    }
  },

  // require
  VariableDeclarator(path) {
    if (
      path.get('init').isCallExpression({
        callee: { type: 'Identifier', name: 'require' },
        arguments: [{ value: 'moment' }],
      })
    ) {
      // path.node.declarations[0]['init'].arguments[0] = j.stringLiteral('dayjs');
      path.node.init['arguments'][0].value = 'dayjs';
    }
  },
});

// ------------------------- replace Moment type --------------------------------------------
// replace Moment type
importTypePath?.scope.rename('Moment', 'Dayjs');
// traverse(ast, {
//   TSTypeReference(path) {
//     if (path.node.typeName['name'] === 'Moment') {
//       path.node.typeName['name'] = 'Dayjs';

//       // replace import type
//       // traverse(path.node,{ImportSpecifier(path) {

//       // }})
//     }
//   },
// });

// -----------------------------------------------------------------------------------------

const output = generate(ast);

console.log(context);
console.log('--------------------------');
console.log(output);
