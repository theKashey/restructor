import {restructure, rename, writeContent} from '../index';
import {gitRenameAsync} from '../versionControl';
import {isJS, isTest} from '../types';
import {isReact, toJSX, isHOC} from "../React";
import {startsFromLower, startsFromCapital, toKebabCase, toCamelCase, keepIndex} from "../letterCase";
import {isClassDefaultExported, nameAsExport} from "../exports";
import {applyAliases, toRelative, renameImports, resolveImports, rewireImports} from '../imports'

export default async function structure(root, initialAliases = {}) {
  const structure = await restructure(root);
  const aliases = {
    '/': root,
    ...initialAliases
  };

  const renamed = rename(structure,
    file => {
      let fileName = file.file;
      if(!isTest(file)) {
        if (isJS(file)) {
          if (isReact(file)) {
            fileName = toJSX(fileName);
          }

          fileName = toKebabCase(fileName);
          fileName = keepIndex(fileName)
          return fileName;
        }
      }
      return null;
    }
  );

  const imported = resolveImports(renamed, {
    '/': root,
    ...aliases
  });

  const result = rewireImports(applyAliases(toRelative(renameImports(imported)), aliases, true))
    .filter(({file, rename, newContent, context}) => (
      (rename && file !== rename) || (newContent && newContent !== context)
    ));

  return result;
}

