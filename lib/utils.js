'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileContent = undefined;

var _fs = require('fs');

const getFileContent = exports.getFileContent = file => new Promise((resolve, reject) => (0, _fs.readFile)(file, 'utf8', (err, data) => {
  if (err) reject(err);
  resolve(data);
}));