'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isReact = exports.toJSX = undefined;

var _types = require('./types');

const toJSX = exports.toJSX = file => {
  if ((0, _types.isEXT)(['.tsx', '.jsx'], file)) {
    return file;
  }
  if ((0, _types.isEXT)(['.ts', '.js'], file)) {
    return file + 'x';
  }
  return file;
};

const isReact = exports.isReact = ({ content }) => content.indexOf('React') >= 0 && content.indexOf('/>') >= 0;