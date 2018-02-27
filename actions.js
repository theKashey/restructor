'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const rename = exports.rename = file => name => ({
  file,
  name,
  action: 'rename'
});