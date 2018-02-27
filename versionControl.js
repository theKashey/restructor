'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const toGit = exports.toGit = names => names.map(({ file, rename }) => `git mv ${file} ${rename}`).join('\n');