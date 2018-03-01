'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rewireImports = exports.applyAliases = exports.nestedToRelative = exports.toRelative = exports.fileApplyAliases = exports.fileNestedToRelative = exports.fileToRelative = exports.renameImports = exports.resolveImports = exports.resolveFileImports = exports.getImports = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

const trimImport = str => str.replace(/['"]/g, '');
const getRelative = (from, to) => {
  const rel = (0, _path.relative)(from, to);
  if (rel[0] !== '.') {
    return '.' + _path.sep + rel;
  }
  return rel;
};

const getImportString = (pattern, selected) => str => (str.match(new RegExp(pattern, 'g')) || []).map(statement => ({
  statement,
  importName: statement.match(new RegExp(pattern, 'i'))[selected],
  rule: pattern
}));

const getDynamicImports = getImportString(`import\\((['"]?[\\w-/.]+['"]?)\\)`, 1);
const getStaticImports = getImportString(`import (.*) from (['"]?[\\w-/.]+['"]?)`, 2);
const getRequires = getImportString(`require\\(([\\'"]?[\\w-/.]+[\\'"]?)\\)`, 1);
const getCSSImports = getImportString(`@import (['"]?[\\w-/.]+['"]?)`, 1);
const getProxyquire = getImportString(`proxyquire([\\w.\\(\\)]+)load\\((.*),`, 2);

const applyAlias = (alias, path, string) => {
  return string.split(path).join(alias);
};

const searchForString = (str, set) => {
  for (let i of set) {
    if (str.startsWith(i)) {
      return i;
    }
  }
  return false;
};

const resolver = (aliases, origin, file) => {
  if (file[0] === '.') {
    return (0, _path.normalize)((0, _path.resolve)(origin, file));
  }
  if (file[0] === '~') {
    return (0, _path.normalize)((0, _path.resolve)(aliases.values['/'], file.substr(1)));
  }
  const aliasKey = searchForString(file, aliases.keys);
  if (aliasKey !== false) {
    return (0, _path.normalize)((0, _path.resolve)(aliases.values[aliasKey], applyAlias('', aliasKey + _path.sep, file)));
  }
  return undefined;
};

const stripExt = file => {
  const { dir, name, ext } = (0, _path.parse)(file);
  if (['.js', '.jsx', '.ts', '.tsx', '.flow'].indexOf(ext) >= 0) {
    return (0, _path.join)(dir, name);
  }
  return file;
};

const renameImport = (importLine, renames) => _extends({}, importLine, {
  resolvedName: renames[importLine.resolvedName] || importLine.resolvedName
});

const getImports = exports.getImports = (content, additional = () => []) => [...getStaticImports(content), ...getDynamicImports(content), ...getRequires(content), ...getProxyquire(content), ...getCSSImports(content), ...additional(content)];

const resolveFileImports = exports.resolveFileImports = (file, aliases, additionalImports = () => []) => {
  const sortedAliases = {
    keys: Object.keys(aliases).sort((a, b) => a.length < b.length).filter(x => x !== '/'),
    values: aliases
  };

  const origin = (0, _path.dirname)(file.file);

  return getImports(file.content, additionalImports).map(statement => {
    const name = resolver(sortedAliases, origin, trimImport(statement.importName));
    return _extends({}, statement, {
      resolvedName: name,
      originalName: trimImport(statement.importName)
    });
  }).filter(({ resolvedName }) => !!resolvedName);
};

const resolveImports = exports.resolveImports = (files, aliases, additionalImports = () => []) => {
  return renameImports(files.map(file => _extends({}, file, {
    imports: resolveFileImports(file, aliases, additionalImports)
  })));
};

const renameImports = exports.renameImports = files => {
  const renames = {};
  files.forEach(file => {
    if (file.rename) {
      renames[file.file] = file.rename;
      renames[stripExt(file.file)] = stripExt(file.rename);
    }
  });

  return files.map(file => _extends({}, file, {
    imports: file.imports.map(line => renameImport(line, renames))
  }));
};

const fileToRelative = exports.fileToRelative = file => {
  const base = (0, _path.dirname)(file.file);
  return _extends({}, file, {
    imports: file.imports.map(line => {
      return _extends({}, line, {
        newName: getRelative(base, line.resolvedName)
      });
    })
  });
};

const fileNestedToRelative = exports.fileNestedToRelative = file => {
  const base = (0, _path.dirname)(file.file);
  return _extends({}, file, {
    imports: file.imports.map(line => {
      if (line.resolvedName.startsWith(file.file)) {
        return _extends({}, line, {
          newName: getRelative(base, line.resolvedName)
        });
      }
      return line;
    })
  });
};

const fileApplyAliases = exports.fileApplyAliases = (file, aliases, preferShorter) => {
  const swappedAliases = Object.keys(aliases).filter(x => x !== '/').reduce((acc, x) => _extends({}, acc, { [aliases[x]]: x }), {});
  const sortedAliases = {
    values: Object.keys(swappedAliases).sort((a, b) => a.length < b.length),
    keys: swappedAliases
  };
  const base = (0, _path.dirname)(file.file);
  return _extends({}, file, {
    imports: file.imports.map(line => {
      const aliasKey = searchForString(line.resolvedName, sortedAliases.values);
      if (aliasKey !== false) {
        const newName = applyAlias(sortedAliases.keys[aliasKey], aliasKey, line.resolvedName);
        const shortName = applyAlias('', aliasKey, line.resolvedName);
        if (!preferShorter || shortName.length < getRelative(base, line.resolvedName).length) {
          return _extends({}, line, {
            newName
          });
        }
      }
      return line;
    })
  });
};

const toRelative = exports.toRelative = files => files.map(file => fileToRelative(file));
const nestedToRelative = exports.nestedToRelative = files => files.map(file => fileNestedToRelative(file));
const applyAliases = exports.applyAliases = (files, aliases, preferShorter) => files.map(file => fileApplyAliases(file, aliases, preferShorter));

const applyRewireImports = ({ content, imports }) => {
  let newContent = content;
  imports.filter(({ newName, originalName }) => newName && newName !== originalName).forEach(line => {
    console.log(line);
    const newImport = line.importName.replace(line.originalName, line.newName);
    const newStatement = line.statement.replace(line.importName, newImport);
    newContent = newContent.replace(line.statement, newStatement);
  });
  return newContent;
};

const rewireImports = exports.rewireImports = files => files.map(file => {
  const newContent = applyRewireImports(file);
  if (newContent && newContent !== file.content) {
    return _extends({}, file, {
      newContent
    });
  }
  return file;
});