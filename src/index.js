import scanDirectory from 'scan-directory';
import {resolve} from 'path';
import {getFileContent, filePutContent} from "./lib/utils";

const ItoI = i => i;

const rejectSystem = (file, stats) =>
  stats.isDirectory() && file.match(/node_modules/) || file.match(/(\/\.\w+)/)

export async function restructure(root, filter = ItoI) {
  const files = filter(await scanDirectory(root, undefined, rejectSystem));

  const awaits = files
    .map(async function (file) {
      const relativeFileName = resolve(root, file);
      const content = await getFileContent(file);
      return {
        file,
        relativeFileName,
        content
      };
    });
  return await Promise.all(awaits);
}

export const rename = (files, callback) => {
  return files
    .map(line => ({
      ...line,
      rename: callback(line)
    }))
};

export async function writeContent(files) {
  await files
    .map(file => {
      if (file.newContent && file.newContent !== file.content) {
        return filePutContent(file.file, file.newContent);
      }
      return Promise.resolve();
    });
  return files;
}


