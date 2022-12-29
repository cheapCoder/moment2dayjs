import { Transform } from 'jscodeshift';
import global from './global';

const transform: Transform = (file, { j, report, stats }, option) => {
  const root = j(file.source);

  root
    .find(j.ImportDeclaration)
    .insertAfter(
      global.plugins.map((name) => `import ${name} from 'dayjs/plugin/${name}';`).join('\n') +
        '\n\n' +
        global.plugins.map((name) => `dayjs.extend(${name})`).join('\n') +
        '\n'
    );
};
