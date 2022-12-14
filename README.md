# moment2dayjs

https://github.com/yanaemon/moment-to-dayjs-codemod

inspired by [moment-dayjs-codemod](https://github.com/rajasegar/moment-dayjs-codemod/)

A collection of codemods for migrating from [moment.js](https://momentjs.com/) to [day.js](https://day.js.org/)

使用[`@typescript-eslint/parser`](https://typescript-eslint.io/architecture/parser/)()处理`jsx|tsx`,其遵循estree标准, `typescript`并不遵循estree规范, 而`@babel/parser`会将注释解析成node[导致问题](https://github.com/facebook/jscodeshift/blob/main/recipes/retain-first-comment.md)

## Usage



## Local Usage


## Feature

- replace `moment` to `dayjs` latest version in package.json 
- work in `js|ts|jsx|tsx`
- api use transform
- ts type transform 
  - import type
  - asset type

## Code Transform

- api transform
  - `moment()` -> `dayjs()`
  - `moment.isMoment()` -> ``
- ts type transform 
  - import type
  - asset type

### Installation

* clone the repo
* change into the repo directory
* `pnpm i`

### Running tests

* `yarn test`

### References

- [代码自动化重构利器——jscodeshift](https://zhuanlan.zhihu.com/p/353940140)
- [You-Don't-Need-Momentjs](https://github.com/you-dont-need/You-Dont-Need-Momentjs)
- [JsCodeShift](https://github.com/facebook/jscodeshift)
- [AST Explorer](https://astexplorer.net/#/gist/7598ca87108e752f21bee9bffbd58ec2/149bbcbeebac06f6dd2290d75e775ec44578694c)
