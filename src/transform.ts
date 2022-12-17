// import { Transform } from "jscodeshift"
// const {Transform } = require("jscodeshift")

import { Transform } from 'jscodeshift';

const transform: Transform = (file, { j, report }, option) => {
  // api.report('what is it')
  // api.stats('liheng', 123123)

  const root = j(file.source);

  const res = root
    .find(j.TSTypeReference)
    .filter(
      (path) => path.node.typeName.type === 'Identifier' && path.node.typeName.name === 'Moment'
    )
    .replaceWith(() => j.tsTypeReference(j.identifier('Dayjs')))
    .toSource();
  console.log(res);

  report(res);

  return res;
};

export default transform;

export const parser = 'tsx';
