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

const toKebabCase = name => {
  return tokenConversion(name)
    .join('-')
    .split('-.')
    .join('.')
};

const camelConversion = name => {
  const newName = tokenConversion(name)
    .map(makeFromCapital)
    .join('');
  return name.charAt(0) + newName.substr(1);
};

export const startsFromCapital = file => {
  const data = parse(file);
  return join(data.dir, makeFromCapital(data.name) + data.ext);
};

export const startsFromLower = file => {
  const data = parse(file);
  return join(data.dir, makeFromLower(data.name) + data.ext);
};

export const loweCaseFileName = file => {
  const data = parse(file);
  return join(data.dir, data.name.toLowerCase() + data.ext);
};

export const upperCaseFileName = file => {
  const data = parse(file);
  return join(data.dir, data.name.toLowerCase() + data.ext);
};

export const keepIndex = file => {
  const data = parse(file);
  const lowerName = data.name.toLowerCase();
  if (lowerName === 'index') {
    return join(data.dir, lowerName + data.ext);
  }
  return file;
}

export const toSnakeCase = file => {
  const data = parse(file);
  return join(data.dir, snakeConversion(data.name) + data.ext);
};

export const toCamelCase = file => {
  const data = parse(file);
  return join(data.dir, camelConversion(data.name) + data.ext);
};