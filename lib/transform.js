"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = void 0;
const config_1 = require("./config");
const fs_1 = require("fs");
const transform = (file, { j, report, stats }, option) => {
    try {
        const root = j(file.source);
        // get context
        const context = {
            // hasImport: false,
            types: [],
            importName: undefined,
            hasImportType: false,
            /** global import plugin  */
            plugin: [],
            /** global import locale */
            extendLocale: new Set(),
        };
        // get default import moment name, moment type and replace the value
        root.find(j.ImportDeclaration).forEach((path) => {
            if (path.node.source.value === 'moment') {
                path.node.specifiers.forEach((n) => {
                    if (n.type === 'ImportDefaultSpecifier') {
                        // import moment name
                        context.importName = n.local.name;
                        // replace name
                        n.local = j.identifier('dayjs');
                    }
                    else if ((0, config_1.structureEqual)(n, { type: 'ImportSpecifier', imported: { name: 'Moment' } })) {
                        //get ts type name
                        context.hasImportType = true;
                        // replace type
                        n.imported['name'] = 'Dayjs';
                    }
                });
                path.node.source.value = 'dayjs';
            }
            else if (path.node.source.value === 'dayjs') {
                // ensure has import dayjs?
                path.node.specifiers.forEach((n) => {
                    if (n.type === 'ImportDefaultSpecifier') {
                        // context.hasImport = true;
                    }
                    else if ((0, config_1.structureEqual)(n, {
                        type: 'ImportSpecifier',
                        imported: {
                            name: 'Dayjs',
                        },
                    })) {
                        context.hasImportType = true;
                    }
                });
            }
            else {
                report(path.node.source.type);
                // replace import locale file
                const matchLocale = path.node.source.type === 'StringLiteral' &&
                    path.node.source.value.match(/moment\/(dist\/)?locale\/([-a-z]+)/);
                if (matchLocale && matchLocale[2]) {
                    path.node.source.value = `dayjs/locale/${matchLocale[2]}`;
                }
            }
        });
        // replace require moment
        root
            .find(j.VariableDeclarator, {
            init: {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'require' },
                arguments: [{ value: 'moment' }],
            },
        })
            .forEach((path) => {
            const patternNode = path.node.id;
            if (patternNode.type === 'Identifier') {
                context.importName = patternNode.name;
                patternNode.name = 'dayjs';
            }
            else if (patternNode.type === 'ObjectPattern') {
                const typeNode = patternNode.properties.find((n) => n.type === 'ObjectProperty' && n.key.type === 'Identifier' && n.key.name === 'Moment');
                if (typeNode) {
                    typeNode.key['name'] = 'Dayjs';
                }
            }
            path.node.init['arguments'][0].value = 'dayjs';
        });
        // set default value
        context.importName || (context.importName = 'moment');
        // replace require locale file
        root
            .find(j.CallExpression, { callee: { type: 'Identifier', name: 'require' } })
            .forEach((path) => {
            const matchLocale = path.node.arguments[0]['value'].match(/moment\/(dist\/)?locale\/([-a-z]+)/);
            if (matchLocale && matchLocale[2]) {
                path.node.arguments[0]['value'] = `dayjs/locale/${matchLocale[2]}`;
            }
        });
        // ------------------------- replace static method --------------------------------------------
        root.find(j.MemberExpression, { object: { name: context.importName } }).forEach((path) => {
            const conf = config_1.staticTransform[path.node.property['name']];
            if (conf === null || conf === void 0 ? void 0 : conf.plugin) {
                context.plugin.push(...conf.plugin);
            }
            if (conf === null || conf === void 0 ? void 0 : conf.rename) {
                path.node.property = j.identifier(conf.rename);
            }
            path.node.object = j.identifier('dayjs');
        });
        // ------------------------- replace instance method --------------------------------------------
        root.find(j.MemberExpression).forEach((path) => {
            var _a;
            const conf = config_1.methodTransform[(_a = path.node.property) === null || _a === void 0 ? void 0 : _a['name']];
            if (!conf)
                return;
            if (conf.transform) {
                try {
                    conf.transform(path, context, { report });
                }
                catch (error) {
                    report(error.message);
                }
            }
            if (conf.plugin) {
                context.plugin.push(...conf.plugin);
            }
            if (conf.rename) {
                path.node.property = j.identifier(conf.rename);
            }
        });
        // // ------------------------- replace `moment()` --------------------------------------------
        root.find(j.CallExpression, { callee: { name: context.importName } }).forEach((path) => {
            // transform array to ...string
            // TODO:
            // transform object to ...string
            // TODO:
            if (path.node.arguments.length > 1) {
                // has second argument -> moment('2022-1-1', 'YYYY-MM-DD HH:mm')
                context.plugin.push('customParseFormat');
            }
            // TODO: is Literal ?
            if (path.node.arguments.length > 2 && path.node.arguments[2].type === 'Literal') {
                // add locale plugin
                context.extendLocale.add(path.node.arguments[2].value);
            }
            path.node.callee = j.identifier('dayjs');
        });
        // ------------------------- replace Moment type --------------------------------------------
        // if (context.hasImportType) {
        root
            .find(j.TSTypeReference, {
            typeName: {
                name: 'Moment',
            },
        })
            .replaceWith(() => j.tsTypeReference(j.identifier('Dayjs')));
        // }
        // -----------------------------------------------------------------------------------------
        const res = root.toSource({ quote: 'auto' });
        const plugins = [...new Set(context.plugin)];
        plugins.length && stats(plugins.join('|'));
        report(JSON.stringify(context));
        // dry run don't write the file
        option.isTest || (0, fs_1.writeFileSync)(file.path, res, { encoding: 'utf-8' });
        return res;
    }
    catch (error) {
        report(error.message);
    }
};
exports.default = transform;
exports.parser = 'tsx';
