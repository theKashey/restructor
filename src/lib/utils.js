import {readFile, writeFile} from 'fs';

export const promisify = (fn, context, noReject) => (...args) => new Promise((resolve, reject) => {
  fn.call(context, ...args, (error, ok) => {
    if (error) {
      if (noReject) {
        resolve(error);
      } else {
        reject(error);
      }
    }
    resolve(ok);
  });
});

const pReadFile = promisify(readFile);
const pWriteFile = promisify(writeFile);

export const getFileContent = file => pReadFile(file, 'utf8');
export const filePutContent = (file, content) => pWriteFile(file, content, 'utf8');