# moment2dayjs

https://github.com/yanaemon/moment-to-dayjs-codemod

inspired by [moment-dayjs-codemod](https://github.com/rajasegar/moment-dayjs-codemod/)

A collection of codemods for migrating from [moment.js](https://momentjs.com/) to [day.js](https://day.js.org/)

使用[`@typescript-eslint/parser`](https://typescript-eslint.io/architecture/parser/)()处理`jsx|tsx`,其遵循estree标准, `typescript`并不遵循estree规范, 而`@babel/parser`会将注释解析成node[导致问题](https://github.com/facebook/jscodeshift/blob/main/recipes/retain-first-comment.md)

## Usage


## Config

- `strict`: 
  - true -> replace method only the caller is `moment(...)`, 
  - false -> replace method as the method is belong to moment


## Feature

- replace `moment` to `dayjs` latest version in package.json 
- work in `js|ts|jsx|tsx`
- api use transform
- ts type transform 
  - import type
  - asset type
  - 泛型

## Code Transform

- [All listed in `You-Dont-Need-Momentjs`](https://github.com/you-dont-need/You-Dont-Need-Momentjs#parse)
- import / require
- mutable to immutable
- api transform
  - `moment()` -> `dayjs()`
  - `moment.isMoment()` -> `dayjs.isDayjs`
- ts type transform 
  - import type
  -`Moment` type asset

### Installation

* clone the repo
* change into the repo directory
* `pnpm i`

### Running tests

* `yarn test`

### References

- [代码自动化重构利器——jscodeshift](https://zhuanlan.zhihu.com/p/353940140)
- [老项目使用 dayjs 替代 moment 的注意事项](https://liuwenzhuang.github.io/2021/10/20/differences-between-dayjs-moment.html)
- [You-Don't-Need-Momentjs](https://github.com/you-dont-need/You-Dont-Need-Momentjs)
- [JsCodeShift](https://github.com/facebook/jscodeshift)
- [AST Explorer](https://astexplorer.net/#/gist/7598ca87108e752f21bee9bffbd58ec2/149bbcbeebac06f6dd2290d75e775ec44578694c)
