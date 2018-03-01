'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isImage = exports.isCSS = exports.isTest = exports.isJS = exports.isContain = exports.isEXT = undefined;

var _path = require('path');

const isEXT = exports.isEXT = (ext, file) => ext.indexOf((0, _path.extname)(file)) >= 0;
const isContain = exports.isContain = (parts, file) => parts.some(part => file.indexOf(part) >= 0);

const isJS = exports.isJS = ({ file }) => isEXT(['.ts', '.tsx', '.js', '.jsx'], file) && file.indexOf('d.ts') === -1;
const isTest = exports.isTest = ({ file }) => isContain(['.spec.', '.test.'], file) && file.indexOf('d.ts') === -1;
const isCSS = exports.isCSS = ({ file }) => isEXT(['.css', '.less', '.sass'], file);
const isImage = exports.isImage = ({ file }) => isEXT(['.png', '.jpg', '.jpeg', '.svg'], file);