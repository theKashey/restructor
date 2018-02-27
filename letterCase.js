'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toCamelCase = exports.toSnakeCase = exports.startsFromLower = exports.startsFromCapital = undefined;

var _path = require('path');

const tokenConversion = name => {
  const parts = [];
  let acc = '';
  name.split('').forEach(c => {
    if (c >= 'a' && c <= 'z' || c >= '0' && c <= '9') {
      acc += c;
    } else {
      parts.push(acc);
      acc = '';

      if (c !== '-' && c !== '_') {
        acc += c;
      }
    }
  });
  parts.push(acc);
  return parts.filter(x => !!x);
};

const makeFromCapital = exports.startsFromCapital = str => str.charAt(0).toUpperCase() + str.substr(1);
const makeFromLower = exports.startsFromLower = str => str.charAt(0).toLowerCase() + str.substr(1);

const snakeConversion = name => {
  return tokenConversion(name).join('-').split('-.').join('.').toLowerCase();
};

const camelConversion = name => {
  return tokenConversion(name).map(makeFromCapital).join('');
};

const startsFromCapital = exports.startsFromCapital = file => {
  const data = (0, _path.parse)(file);
  return (0, _path.join)(data.dir, makeFromCapital(data.name) + data.ext);
};

const startsFromLower = exports.startsFromLower = file => {
  const data = (0, _path.parse)(file);
  return (0, _path.join)(data.dir, makeFromLower(data.name) + data.ext);
};

const toSnakeCase = exports.toSnakeCase = file => {
  const data = (0, _path.parse)(file);
  return (0, _path.join)(data.dir, snakeConversion(data.name) + data.ext);
};

const toCamelCase = exports.toCamelCase = file => {
  const data = (0, _path.parse)(file);
  return (0, _path.join)(data.dir, camelConversion(data.name) + data.ext);
};