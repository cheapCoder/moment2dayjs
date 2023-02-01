"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transform = (file, { j, report, stats }, { plugins = [] }) => {
    try {
        const root = j(file.source);
        let hasImportDayjs = false;
        // import
        let importPaths = root.find(j.ImportDeclaration);
        if (importPaths.length) {
            importPaths.forEach((p, i, paths) => {
                if (p.node.source.value === 'dayjs' &&
                    p.node.specifiers.some((n) => n.type === 'ImportDefaultSpecifier')) {
                    hasImportDayjs = true;
                }
                if (i === paths.length - 1) {
                    p.insertAfter((hasImportDayjs ? '' : 'import dayjs from "dayjs";\n') +
                        plugins.map((name) => `import ${name} from 'dayjs/plugin/${name}';`).join('\n') +
                        '\n\n' +
                        plugins.map((name) => `dayjs.extend(${name});`).join('\n'));
                }
            });
        }
        else {
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
                importPaths.forEach((p, i, paths) => {
                    var _a;
                    if (p.node.id.type === 'Identifier' &&
                        ((_a = p.node.init['arguments']) === null || _a === void 0 ? void 0 : _a.length) === 1 &&
                        p.node['arguments'][0]['value'] === 'dayjs') {
                        hasImportDayjs = true;
                    }
                    if (i === paths.length - 1) {
                        p.insertAfter((hasImportDayjs ? '' : 'const dayjs = require("dayjs");\n') +
                            plugins
                                .map((name) => `const ${name} = require('dayjs/plugin/${name}');`)
                                .join('\n') +
                            '\n\n' +
                            plugins.map((name) => `dayjs.extend(${name});`).join('\n'));
                    }
                });
            }
        }
        return root.toSource();
    }
    catch (error) {
        report(error.message);
    }
};
exports.default = transform;
