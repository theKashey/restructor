'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _index = require('../index');

var _versionControl = require('../versionControl');

var _types = require('../types');

var _React = require('../React');

var _letterCase = require('../letterCase');

var _exports = require('../exports');

var _imports = require('../imports');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (root, initialAliases = {}, finalAliases = {}) {
    const structure = yield (0, _index.restructure)(root);
    const aliases = _extends({
      '/': root
    }, initialAliases);

    const imported = (0, _imports.resolveImports)(structure, aliases);

    const result = (0, _imports.rewireImports)((0, _imports.applyAliases)((0, _imports.toRelative)((0, _imports.renameImports)(imported)), finalAliases, true)).filter(function ({ file, rename, newContent, context }) {
      return rename && file !== rename || newContent && newContent !== context;
    });

    return result;
  });

  function structure(_x) {
    return _ref.apply(this, arguments);
  }

  return structure;
})();