"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generator_1 = __importDefault(require("@babel/generator"));
const parser_1 = require("@babel/parser");
const traverse_1 = __importDefault(require("@babel/traverse"));
const promises_1 = require("fs/promises");
const config_1 = require("./config");
const transform = (path) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const code = yield (0, promises_1.readFile)(path, { encoding: 'utf-8' });
    console.log(code);
    let ast;
    try {
        ast = (0, parser_1.parse)(code, config_1.babelConfig);
    }
    catch (error) {
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
    let importPath;
    let importTypePath;
    // get default import moment name, moment type and replace the value
    (0, traverse_1.default)(ast, {
        ImportDeclaration(path) {
            if (path.node.source.value === 'moment') {
                path.get('specifiers').forEach((p) => {
                    if (p.isImportDefaultSpecifier()) {
                        // import moment name
                        context.importName = p.node.local.name;
                        importPath = p;
                        // replace type
                        p.node.local.name = 'dayjs';
                    }
                    else if ((0, config_1.structureEqual)(p.node, { type: 'ImportSpecifier', imported: { name: 'Moment' } })) {
                        //get ts type name
                        context.importTypeName = p.node.local.name;
                        importTypePath = p;
                        // replace type
                        p.node.imported['name'] = 'Dayjs';
                    }
                });
                path.node.source.value = 'dayjs';
                // importPath && importTypePath && path.stop();
            }
            else if (path.node.source.value === 'dayjs') {
                // ensure has import dayjs?
                path.get('specifiers').forEach((p) => {
                    if (p.isImportDefaultSpecifier()) {
                        context.hasImport = true;
                    }
                    else if ((0, config_1.structureEqual)(p.node, {
                        type: 'ImportSpecifier',
                        imported: {
                            name: 'Dayjs',
                        },
                    })) {
                        context.hasType = true;
                    }
                });
            }
        },
        VariableDeclarator(path) {
            if ((0, config_1.structureEqual)(path.node.init, {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'require' },
                arguments: [{ value: 'moment' }],
            })) {
                const patternNode = path.node.id;
                if (patternNode.type === 'Identifier') {
                    context.importName = patternNode.name;
                    patternNode.name = 'dayjs';
                }
                else if (patternNode.type === 'ObjectPattern') {
                    const typeNode = patternNode.properties.find((n) => n.type === 'ObjectProperty' && n.key.type === 'Identifier' && n.key.name === 'Moment');
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
    (_a = importPath === null || importPath === void 0 ? void 0 : importPath.scope.bindings[context.importName]) === null || _a === void 0 ? void 0 : _a.referencePaths.forEach((p) => {
        if (p.parent.type === 'MemberExpression') {
            // static method
            const conf = config_1.staticTransform[p.parent.property['name']];
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
    (0, traverse_1.default)(ast, {
        // ------------------------- replace instance method --------------------------------------------
        MemberExpression: (path) => {
            var _a;
            const conf = config_1.methodTransform[(_a = path.node.property) === null || _a === void 0 ? void 0 : _a['name']];
            if (!conf)
                return;
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
            if ((0, config_1.structureEqual)(path.node, { callee: { name: context.importName } })) {
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
    importPath === null || importPath === void 0 ? void 0 : importPath.scope.rename('moment', 'dayjs');
    if (context.hasImport) {
        importPath === null || importPath === void 0 ? void 0 : importPath.remove();
    }
    // ------------------------- replace Moment type --------------------------------------------
    importTypePath === null || importTypePath === void 0 ? void 0 : importTypePath.scope.rename('Moment', 'Dayjs');
    if (context.hasType) {
        importTypePath === null || importTypePath === void 0 ? void 0 : importTypePath.remove();
    }
    // -----------------------------------------------------------------------------------------
    const output = (0, generator_1.default)(ast, undefined, code);
    console.log(context);
    console.log('--------------------------');
    // console.log(output);
    yield (0, promises_1.writeFile)(path, output.code);
});
exports.default = transform;
