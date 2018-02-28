'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isHOC = exports.isReact = exports.toJSX = exports.defaultHOCs = undefined;

var _types = require('./types');

const defaultHOCs = exports.defaultHOCs = ['connect', 'hot', 'class'];

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

const isHOC = exports.isHOC = ({ content }, HOCs = []) => {
  const match = content.match(/export default (\w+)/i);
  return match && [...HOCs, ...defaultHOCs].indexOf(match[1]) >= 0;
};