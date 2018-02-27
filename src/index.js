import scanDirectory from 'scan-directory';
import {resolve,} from 'path';
import {getFileContent} from "./lib/utils";

const ItoI = i => i;

export const rejectSystem = (file, stats) =>
  stats.isDirectory() && file.match(/node_modules/) || file.match(/(\/\.\w+)/)

//acceptAll

async function restructure(root, callback, filter = ItoI) {
  const files = filter(await scanDirectory(root, undefined, rejectSystem));

  const awaits = files
    .map(async function (file) {
      const relativeFileName = resolve(root, file);
      const content = await getFileContent(file);
      return {
        file,
        relativeFileName,
        content,
        actions: []
      };
    });

  const mappedFiles = await Promise.all(awaits);

  return mappedFiles
    .map(line => Object.assign({}, line, {
        rename: callback(line)
      }
    ))
    .filter(({file, rename}) => rename && rename !== file);
}


export {}

export default restructure;

