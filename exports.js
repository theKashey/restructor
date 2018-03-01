'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nameAsExport = exports.isClassDefaultExported = undefined;

var _path = require('path');

const isClassDefaultExported = exports.isClassDefaultExported = ({ content }) => {
  const match = content.match(/export default (\w)/i);
  return match && match[1] === match[1].toUpperCase();
};

const nameAsExport = exports.nameAsExport = ({ file, content }) => {
  const data = (0, _path.parse)(file);
  const match = content.match(/export default (\w+)/i);
  if (match && match[1]) {
    return (0, _path.join)(data.dir, match[1] + data.ext);
  } else {
    return file;
  }
};