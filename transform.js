// import { Transform } from "jscodeshift"
// const {Transform } = require("jscodeshift")

/** @type {import('jscodeshift').Transform} */
const transform = (file, { j }, option) => {
  // api.report('what is it')
  // api.stats('liheng', 123123)

  const root = j(file.source);
  
  console.log(root.findJSXElements('what').insertAfter('insert').toSource());

  // console.log(file.source);
  return file.source;
};

module.exports = transform;

module.exports.parser = 'tsx';


export const parser = 'tsx'

// Press ctrl+space for code completion
/** @type {import('jscodeshift').Transform} */
export default function transformer(file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.NumericLiteral)
    // .remove()

    // .insertAfter('123132')
    .replaceWith(node => j.stringLiteralTypeAnnotation('string'))
    .toSource();
}
