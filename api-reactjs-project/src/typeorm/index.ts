import * as fs from 'fs';

function getFiles(prefix) {
  const result = [];
  function innerRecursion(prefix) {
    const __dirname = fs.realpathSync('.');
    const files = fs.readdirSync(__dirname + '/src/' + prefix);

    for (const file of files) {
      if (file.endsWith(`.ts`)) {
        result.push(prefix + '/' + file);
      } else if (!file.includes('.')) {
        innerRecursion(prefix + '/' + file);
      }
    }
  }
  innerRecursion(prefix);
  return result;
}

async function dynamicImport(prefix) {
  const entityFiles = getFiles(prefix);
  const entity = await Promise.all(
    entityFiles.map((file) => {
      return import(file.replace('typeorm', '.').replace('.ts', '')) as never;
    }),
  );
  return entity.map((x) => x[Object.keys(x)[0]] || (x as any).default);
}

export async function getEntities() {
  return await dynamicImport('typeorm/entity');
}
