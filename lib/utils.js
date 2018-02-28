'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filePutContent = exports.getFileContent = exports.promisify = undefined;

var _fs = require('fs');

const promisify = exports.promisify = (fn, context, noReject) => (...args) => new Promise((resolve, reject) => {
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

const pReadFile = promisify(_fs.readFile);
const pWriteFile = promisify(_fs.writeFile);

const getFileContent = exports.getFileContent = file => pReadFile(file, 'utf8');
const filePutContent = exports.filePutContent = (file, content) => pWriteFile(file, content, 'utf8');