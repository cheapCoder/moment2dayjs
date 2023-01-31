import { ParserOptions } from '@babel/parser';

const mapConfig = (config: Record<string, Record<string, any>>) => {
  return Object.keys(config).reduce((copy, key) => {
    // convert `xxx|xxx` to ['xxx', 'xxx']
    if (config[key].plugin) {
      config[key].plugin = config[key].plugin.split('|');
    }

    // convert `max|min: xxx` to `max: xxx, min: xxx`
    key.split('|').forEach((part) => {
      if (config[key]) {
        copy[part] = { ...config[part], ...config[key] };
      } else {
        copy[part] = config[key];
      }
    });
    return copy;
  }, {});
};

export const staticTransform = mapConfig({
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

// }[]
export const methodTransform: Record<
  string,
  {
    name: RegExp;
    rename?: string;
    plugin?: string[];
    transform?: (path, context: any) => any;
  }
> = mapConfig({
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
  utc: {
    plugin: 'utc',
  },
  utcOffset: {
    transform: (path, context) => {
      // need utc plugin if has argument
      if (path.node.arguments?.length > 0) {
        context.plugin.push('utc');
      }
      return path;
    },
  },
  // -------------------------------- Display ---------------------------
  'fromNow|from|toNow|to': {
    plugin: 'relativeTime',
  },
  calendar: {
    plugin: 'calendar',
  },
  toArray: {
    plugin: 'toArray',
  },
  toObject: {
    plugin: 'toObject',
  },
  // -------------------------------- Query ---------------------------
  isSameOrBefore: {
    plugin: 'isSameOrBefore',
  },
  isSameOrAfter: {
    plugin: 'isSameOrAfter',
  },
  isBetween: {
    plugin: 'isBetween',
  },
  isLeapYear: {
    plugin: 'isLeapYear',
  },

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

export const babelConfig: ParserOptions = {
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
export const structureEqual = (actual: any, expected: any) => {
  try {
    if (Array.isArray(expected)) {
      return expected.every((v, i) => structureEqual(actual[i], v));
    }
    if (typeof expected === 'object' && expected !== null) {
      const keys = Object.keys(expected);
      return keys.every((k) => structureEqual(actual[k], expected[k]));
    }
    return actual === expected;
  } catch (error) {
    return false;
  }
};
