'use strict';

let structure = (() => {
  var _ref = _asyncToGenerator(function* () {

    const structure = yield (0, _index2.default)('/Users/akorzunov/dev/Z/mellis/github/utils/restate', function (file) {
      let fileName = file.file;
      if ((0, _types.isJS)(file)) {
        if ((0, _React.isReact)(file)) {
          fileName = (0, _React.toJSX)(fileName);
        }

        fileName = (0, _letterCase.toSnakeCase)(fileName);
        if (!(0, _exports.isClassDefaultExported)(file)) {
          fileName = (0, _letterCase.startsFromLower)(fileName);
        } else {
          fileName = (0, _letterCase.startsFromCapital)(fileName);
        }
        return fileName;
      }
      return null;
    });

    console.log((0, _versionControl.toGit)(structure));
  });

  return function structure() {
    return _ref.apply(this, arguments);
  };
})();

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _versionControl = require('../versionControl');

var _types = require('../types');

var _React = require('../React');

var _letterCase = require('../letterCase');

var _exports = require('../exports');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

structure();