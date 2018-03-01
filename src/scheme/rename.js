import {restructure, rename, writeContent} from '../index';
import {gitRenameAsync} from '../versionControl';
import {isJS, isTest} from '../types';
import {isReact, toJSX, isHOC} from "../React";
import {startsFromLower, startsFromCapital, toSnakeCase, toCamelCase, keepIndex} from "../letterCase";
import {isClassDefaultExported, nameAsExport} from "../exports";
import {applyAliases, toRelative, renameImports, resolveImports, rewireImports} from '../imports'

export default async function structure(root, callback, initialAliases = {}) {
  const structure = await restructure(root);
  const aliases = {
    '/': root,
    ...initialAliases
  };

  const renamed = rename(structure, callback);

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