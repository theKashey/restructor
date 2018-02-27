'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCSS = exports.isJS = exports.isEXT = undefined;

var _path = require('path');

const isEXT = exports.isEXT = (ext, file) => ext.indexOf((0, _path.extname)(file)) >= 0;
const isJS = exports.isJS = ({ file }) => isEXT(['.ts', '.tsx', '.js', '.jsx'], file) && file.indexOf('d.ts') === -1;
const isCSS = exports.isCSS = ({ file }) => isEXT(['.css', '.less', '.sass'], file);