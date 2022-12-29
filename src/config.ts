import { ASTPath, CallExpression } from 'jscodeshift';

export const staticTransform = [
  {
    name: /^(min|max)$/,
    plugin: ['minMax'],
  },
  { name: /^utc$/, plugin: ['utc'] },
  {
    name: /^isMoment$/,
    rename: 'isDayjs',
  },
];

export const methodTransform: {
  name: RegExp;
  rename?: string;
  plugin?: string[];
  transform?: (path: ASTPath<CallExpression>, context: any, tools: any) => any;
}[] = [
  // -------------------------------- Get + Set ---------------------------
  { name: /^milliseconds$/, rename: 'millisecond' },
  { name: /^seconds$/, rename: 'second' },
  { name: /^minutes$/, rename: 'minute' },
  { name: /^hours$/, rename: 'hour' },
  { name: /^dates$/, rename: 'date' },
  { name: /^days$/, rename: 'day' },
  { name: /^weekday$/, plugin: ['weekday'] },
  { name: /^(isoWeekday|isoWeekYear)$/, plugin: ['isoWeek'] },
  { name: /^dayOfYear$/, plugin: ['dayOfYear'] },
  {
    name: /^(weeks?|weeksInYear)$/,
    plugin: ['weekOfYear'],
    rename: 'week',
  },
  {
    name: /^(isoWeeks?)$/,
    plugin: ['isoWeek'],
    rename: 'isoWeek',
  },
  {
    name: /^(isoWeeksInYear)$/,
    plugin: ['isoWeeksInYear', 'isLeapYear'],
  },
  { name: /^months$/, rename: 'month' },
  {
    name: /^quarters?$/,
    plugin: ['quarterOfYear'],
    rename: 'quarter',
  },
  { name: /^years$/, rename: 'year' },
  {
    name: /^weekYear$/,
    plugin: ['weekYear', 'weekOfYear'],
  },
  // {
  //   name: /^get$/,
  //   // when
  // },
  {
    name: /^set$/,
    // when
    // argument: [{ when: 'object...' }],
  },
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
  {
    name: /^startOf|endOf$/,
    transform: (path, context) => {
      // quarter -> quarterOfYear
      // isoWeek -> isoWeek

      return path;
    },
  },
  {
    name: /^utc$/,
    plugin: ['utc'],
  },
  {
    name: /^utcOffset$/,
    transform: (path, context, { stats, report }) => {
      // need utc plugin if has argument
      if (path.node.arguments.length > 0) {
        context.extendPlugins.push('utc');
      }
      return path;
    },
  },
  // -------------------------------- Display ---------------------------
  {
    name: /^(fromNow|from|toNow|to)$/,
    plugin: ['relativeTime'],
  },
  {
    name: /^calendar$/,
    plugin: ['calendar'],
  },
  {
    name: /^toArray$/,
    plugin: ['toArray'],
  },
  {
    name: /^toObject$/,
    plugin: ['toObject'],
  },
  // -------------------------------- Query ---------------------------
  {
    name: /^isSameOrBefore$/,
    plugin: ['isSameOrBefore'],
  },
  {
    name: /^isSameOrAfter$/,
    plugin: ['isSameOrAfter'],
  },
  {
    name: /^isBetween$/,
    plugin: ['isBetween'],
  },
  {
    name: /^isLeapYear$/,
    plugin: ['isLeapYear'],
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
];
