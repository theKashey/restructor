'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rejectSystem = undefined;

//acceptAll

let restructure = (() => {
  var _ref = _asyncToGenerator(function* (root, callback, filter = ItoI) {
    const files = filter((yield (0, _scanDirectory2.default)(root, undefined, rejectSystem)));

    const awaits = files.map((() => {
      var _ref2 = _asyncToGenerator(function* (file) {
        const relativeFileName = (0, _path.resolve)(root, file);
        const content = yield (0, _utils.getFileContent)(file);
        return {
          file,
          relativeFileName,
          content,
          actions: []
        };
      });

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    })());

    const mappedFiles = yield Promise.all(awaits);

    return mappedFiles.map(function (line) {
      return Object.assign({}, line, {
        rename: callback(line)
      });
    }).filter(function ({ file, rename }) {
      return rename && rename !== file;
    });
  });

  return function restructure(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

var _scanDirectory = require('scan-directory');

var _scanDirectory2 = _interopRequireDefault(_scanDirectory);

var _path = require('path');

var _utils = require('./lib/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ItoI = i => i;

const rejectSystem = exports.rejectSystem = (file, stats) => stats.isDirectory() && file.match(/node_modules/) || file.match(/(\/\.\w+)/);exports.default = restructure;