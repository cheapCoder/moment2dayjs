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
  // unix: no need change
});

// : {
//   name: RegExp;
//   rename?: string;
//   plugin?: string[];
//   transform?: (path: ASTPath<CallExpression>, context: any, tools: any) => any;
// }[]
export const methodTransform = mapConfig({
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
  //     // ??????????????????????????????
  //     // 'string, number'??????'number, string'

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
    transform: (path, context, { stats, report }) => {
      // need utc plugin if has argument
      if (path.node.arguments.length > 0) {
        context.extendPlugins.push('utc');
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
