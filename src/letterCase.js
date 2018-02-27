import {parse, join} from 'path';

const tokenConversion = name => {
  const parts = [];
  let acc = '';
  name
    .split('')
    .forEach(c => {
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
  return tokenConversion(name)
    .join('-')
    .split('-.')
    .join('.')
    .toLowerCase();
};

const camelConversion = name => {
  return tokenConversion(name)
    .map(makeFromCapital)
    .join('')
};

export const startsFromCapital = file => {
  const data = parse(file);
  return join(data.dir, makeFromCapital(data.name) + data.ext);
};

export const startsFromLower = file => {
  const data = parse(file);
  return join(data.dir, makeFromLower(data.name) + data.ext);
};

export const toSnakeCase = file => {
  const data = parse(file);
  return join(data.dir, snakeConversion(data.name) + data.ext);
};

export const toCamelCase = file => {
  const data = parse(file);
  return join(data.dir, camelConversion(data.name) + data.ext);
};