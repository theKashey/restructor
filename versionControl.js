'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gitRenameAsync = undefined;

let ensurePathExists = (() => {
  var _ref = _asyncToGenerator(function* (path, lookup) {
    const parts = path.split(_path.sep);
    const commands = [];
    let currentPath = '';

    for (let dir of parts) {
      currentPath = currentPath + dir;
      if (!lookup[currentPath]) {
        lookup[currentPath] = true;
        commands.push(pDir(currentPath));
      }
      currentPath += _path.sep;
    }

    yield Promise.all(commands);
  });

  return function ensurePathExists(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let gitRenameAsync = exports.gitRenameAsync = (() => {
  var _ref2 = _asyncToGenerator(function* (names) {
    const lookup = {};
    yield Promise.all(names.map(function ({ rename }) {
      return ensurePathExists(rename, lookup);
    }));
    yield names.map(function ({ file, rename }) {
      return `git mv ${file} ${rename}`;
    }).map(pExec);
  });

  return function gitRenameAsync(_x3) {
    return _ref2.apply(this, arguments);
  };
})();

var _path = require('path');

var _fs = require('fs');

var _utils = require('./lib/utils');

var _child_process = require('child_process');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const pDir = (0, _utils.promisify)(_fs.mkdir, null, true);
const pExec = (0, _utils.promisify)(_child_process.exec);