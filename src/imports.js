import {resolve, relative, normalize, dirname, sep, parse, join} from 'path';

const trimImport = str => str.replace(/['"]/g, '');
const getRelative = (from, to) => {
  const rel = relative(from, to);
  if (rel[0] !== '.') {
    return '.' + sep + rel;
  }
  return rel;
};

const getImportString = (pattern, selected) => str => (
  (str.match(new RegExp(pattern, 'g')) || [])
    .map(statement => ({
      statement,
      importName: statement.match(new RegExp(pattern, 'i'))[selected],
      rule: pattern
    }))
);

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
      return i
    }
  }
  return false;
};

const resolver = (aliases, origin, file) => {
  if (file[0] === '.') {
    return normalize(resolve(origin, file));
  }
  if (file[0] === '~') {
    return normalize(resolve(aliases.values['/'], file.substr(1)));
  }
  const aliasKey = searchForString(file, aliases.keys);
  if (aliasKey !== false) {
    return normalize(resolve(aliases.values[aliasKey], applyAlias('', aliasKey + sep, file)));
  }
  return undefined;
};

const stripExt = file => {
  const {dir, name, ext} = parse(file);
  if (['.js', '.jsx', '.ts', '.tsx', '.flow'].indexOf(ext) >= 0) {
    return join(dir, name);
  }
  return file;
};

const renameImport = (importLine, renames) => ({
  ...importLine,
  resolvedName: renames[importLine.resolvedName] || importLine.resolvedName
});

export const getImports = (content, additional = () => []) => [
  ...getStaticImports(content),
  ...getDynamicImports(content),
  ...getRequires(content),
  ...getProxyquire(content),
  ...getCSSImports(content),
  ...additional(content)
];

export const resolveFileImports = (file, aliases, additionalImports = () => []) => {
  const sortedAliases = {
    keys: Object.keys(aliases).sort((a, b) => a.length < b.length).filter(x => x!=='/'),
    values: aliases
  };

  const origin = dirname(file.file);

  return getImports(file.content, additionalImports)
    .map(statement => {
      const name = resolver(sortedAliases, origin, trimImport(statement.importName));
      return {
        ...statement,
        resolvedName: name,
        originalName: trimImport(statement.importName)
      }
    })
    .filter(({resolvedName}) => !!resolvedName);
};

export const resolveImports = (files, aliases, additionalImports = () => []) => {
  return renameImports(files.map(file => ({
    ...file,
    imports: resolveFileImports(file, aliases, additionalImports)
  })));
};

export const renameImports = (files) => {
  const renames = {};
  files.forEach(file => {
    if (file.rename) {
      renames[file.file] = file.rename;
      renames[stripExt(file.file)] = stripExt(file.rename);
    }
  });

  return files.map(file => ({
    ...file,
    imports: file.imports.map(line => renameImport(line, renames))
  }))
}

export const fileToRelative = (file) => {
  const base = dirname(file.file);
  return {
    ...file,
    imports: file.imports.map(line => {
      return {
        ...line,
        newName: getRelative(base, line.resolvedName)
      }
    })
  }
};

export const fileNestedToRelative = (file) => {
  const base = dirname(file.file);
  return {
    ...file,
    imports: file.imports.map(line => {
      if (line.resolvedName.startsWith(file.file)) {
        return {
          ...line,
          newName: getRelative(base, line.resolvedName)
        }
      }
      return line;
    })
  }
};

export const fileApplyAliases = (file, aliases, preferShorter) => {
  const swappedAliases = Object.keys(aliases).filter(x => x!=='/').reduce((acc, x) => ({...acc, [aliases[x]]: x}), {})
  const sortedAliases = {
    values: Object.keys(swappedAliases).sort((a, b) => a.length < b.length),
    keys: swappedAliases
  };
  const base = dirname(file.file);
  return {
    ...file,
    imports: file.imports.map(line => {
      const aliasKey = searchForString(line.resolvedName, sortedAliases.values);
      if (aliasKey !== false) {
        const newName = applyAlias(sortedAliases.keys[aliasKey], aliasKey, line.resolvedName);
        const shortName = applyAlias('', aliasKey, line.resolvedName);
        if (!preferShorter || shortName.length < getRelative(base, line.resolvedName).length) {
          return {
            ...line,
            newName
          }
        }
      }
      return line;
    })
  }
};

export const toRelative = files => files.map(file => fileToRelative(file));
export const nestedToRelative = files => files.map(file => fileNestedToRelative(file));
export const applyAliases = (files, aliases, preferShorter) => files.map(file => fileApplyAliases(file, aliases, preferShorter));

const applyRewireImports = ({content, imports}) => {
  let newContent = content;
  imports
    .filter(({newName, originalName}) => newName && newName !== originalName)
    .forEach(line => {
      const newImport = line.importName.replace(line.originalName, line.newName);
      const newStatement = line.statement.replace(line.importName, newImport);
      newContent = newContent.replace(line.statement, newStatement);
    });
  return newContent;
};

export const rewireImports = files => (
  files.map(file => {
    const newContent = applyRewireImports(file);
    if (newContent && newContent !== file.content) {
      return {
        ...file,
        newContent
      }
    }
    return file;
  })
);




