import * as Parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

const code = `function square(n) {
  return n * n;
}`;

const ast = Parser.parse(code);

traverse(ast, {
  enter(path) {
    path.scope.rename('n', 'x');
    if (path.isIdentifier({ name: 'n' })) {
      path.node.name = 'x';
    }
  },
});

const output = generate(ast);

console.log(output);

