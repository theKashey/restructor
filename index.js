'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeContent = exports.rename = exports.restructure = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let restructure = exports.restructure = (() => {
  var _ref = _asyncToGenerator(function* (root, filter = ItoI) {
    const files = filter((yield (0, _scanDirectory2.default)(root, undefined, rejectSystem)));

    const awaits = files.map((() => {
      var _ref2 = _asyncToGenerator(function* (file) {
        const relativeFileName = (0, _path.resolve)(root, file);
        const content = yield (0, _utils.getFileContent)(file);
        return {
          file,
          relativeFileName,
          content
        };
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })());
    return yield Promise.all(awaits);
  });

  return function restructure(_x) {
    return _ref.apply(this, arguments);
  };
})();

let writeContent = exports.writeContent = (() => {
  var _ref3 = _asyncToGenerator(function* (files) {
    yield files.map(function (file) {
      if (file.newContent && file.newContent !== file.content) {
        console.log('updating', file.file);
        return (0, _utils.filePutContent)(file.file, file.newContent);
      }
      return Promise.resolve();
    });
    return files;
  });

  return function writeContent(_x3) {
    return _ref3.apply(this, arguments);
  };
})();

var _scanDirectory = require('scan-directory');

var _scanDirectory2 = _interopRequireDefault(_scanDirectory);

var _path = require('path');

var _utils = require('./lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ItoI = i => i;

const rejectSystem = (file, stats) => stats.isDirectory() && file.match(/node_modules/) || file.match(/(\/\.\w+)/);

const rename = exports.rename = (files, callback) => {
  return files.map(line => _extends({}, line, {
    rename: callback(line)
  }));
};