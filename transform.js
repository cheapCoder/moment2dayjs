// import { Transform } from "jscodeshift"
// const {Transform } = require("jscodeshift")


/** @type {import('jscodeshift').Transform} */
const transform = (file, api, option) => {
// api.report('what is it')
// api.stats('liheng', 123123)

const root = api.j(file.source);

  console.log(root.findJSXElements('what').insertAfter("insert").toSource());



// console.log(file.source);
  return file.source;

}


module.exports =  transform