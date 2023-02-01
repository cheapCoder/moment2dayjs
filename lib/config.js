"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.structureEqual = exports.babelConfig = exports.methodTransform = exports.staticTransform = void 0;
const mapConfig = (config) => {
    return Object.keys(config).reduce((copy, key) => {
        // convert plugin `xxx|xxx` to ['xxx', 'xxx']
        if (config[key].plugin) {
            config[key].plugin = config[key].plugin.split('|');
        }
        // convert `max|min: xxx` to `max: xxx, min: xxx`
        key.split('|').forEach((part) => {
            if (config[key]) {
                copy[part] = Object.assign(Object.assign({}, config[part]), config[key]);
            }
            else {
                copy[part] = config[key];
            }
        });
        return copy;
    }, {});
};
exports.staticTransform = mapConfig({
    'max|min': {
        plugin: 'minMax',
    },
    utc: {
        plugin: 'utc',
    },
    isMoment: {
        rename: 'isDayjs',
    },
    duration: {
        plugin: 'duration',
    },
    // unix: no need change
});
exports.methodTransform = mapConfig({
    // -------------------------------- Get + Set ---------------------------
    milliseconds: { rename: 'millisecond' },
    seconds: { rename: 'second' },
    minutes: { rename: 'minute' },
    hours: { rename: 'hour' },
    dates: { rename: 'date' },
    days: { rename: 'day' },
    'weekday|weekdays': { plugin: 'weekday' },
    'isoWeekday|isoWeekYear': { plugin: 'isoWeek' },
    dayOfYear: { plugin: 'dayOfYear' },
    'week|weeks': {
        plugin: 'weekOfYear',
        rename: 'week',
    },
    'isoWeek|isoWeeks': {
        plugin: 'isoWeek',
        rename: 'isoWeek',
    },
    isoWeeksInYear: {
        plugin: 'isoWeeksInYear|isLeapYear',
    },
    months: { rename: 'month' },
    'quarter|quarters': {
        plugin: 'quarterOfYear',
        rename: 'quarter',
    },
    years: { rename: 'year' },
    weekYear: {
        plugin: 'weekYear|weekOfYear',
    },
    // {
    //   name: /^get$/,
    //   // when
    // },
    // {
    // name: /^set$/,
    // when
    // argument: [{ when: 'object...' }],
    // },
    // -------------------------------- Manipulate ---------------------------
    // {
    //   name: /^add|subtract$/,
    //   // TODO:
    //   transform: (path, context) => {
    //     // 对象参数转为链式调用
    //     // 'string, number'转为'number, string'
    //     return path;
    //   },
    // },
    'startOf|endOf': {
        transform: (path, context) => {
            // quarter -> quarterOfYear
            // isoWeek -> isoWeek
            return path;
        },
    },
    utc: { plugin: 'utc' },
    utcOffset: {
        transform: (path, context, api = {}) => {
            var _a;
            // need utc plugin if has argument, different to babel, can't use path.parent
            if (((_a = path.parentPath) === null || _a === void 0 ? void 0 : _a.node.type) === 'CallExpression' &&
                path.parentPath.node.arguments.length > 0) {
                context.plugin.push('utc');
            }
        },
    },
    // -------------------------------- Display ---------------------------
    'fromNow|from|toNow|to': { plugin: 'relativeTime' },
    calendar: { plugin: 'calendar' },
    toArray: { plugin: 'toArray' },
    toObject: { plugin: 'toObject' },
    // -------------------------------- Query ---------------------------
    isSameOrBefore: { plugin: 'isSameOrBefore' },
    isSameOrAfter: { plugin: 'isSameOrAfter' },
    isBetween: { plugin: 'isBetween' },
    isLeapYear: { plugin: 'isLeapYear' },
    // {
    //   name: /^isDate$/,
    //   transform: (path, context) => {
    //     const arg = path.node.arguments[0];
    //     if (
    //       path.node.callee.type === 'MemberExpression' &&
    //       path.node.callee.object?.name === context.importName &&
    //       arg
    //     ) {
    //       path
    //     }
    //     return path;
    //   },
    // },
});
exports.babelConfig = {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    startLine: 1,
    tokens: false,
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
// check if the value exist in expected equal the value in actual
const structureEqual = (actual, expected) => {
    try {
        if (Array.isArray(expected)) {
            return expected.every((v, i) => (0, exports.structureEqual)(actual[i], v));
        }
        if (typeof expected === 'object' && expected !== null) {
            const keys = Object.keys(expected);
            return keys.every((k) => (0, exports.structureEqual)(actual[k], expected[k]));
        }
        return actual === expected;
    }
    catch (error) {
        return false;
    }
};
exports.structureEqual = structureEqual;
