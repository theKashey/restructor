import {restructure, rename, writeContent} from '../index';
import {gitRenameAsync} from '../versionControl';
import {isJS} from '../types';
import {isReact, toJSX, isHOC} from "../React";
import {startsFromLower, startsFromCapital, toSnakeCase, toCamelCase, keepIndex} from "../letterCase";
import {isClassDefaultExported, nameAsExport} from "../exports";
import {applyAliases, toRelative, renameImports, resolveImports, rewireImports} from '../imports'

export default async function structure(root, aliases = {}) {
  const structure = await restructure(root);

  const renamed = rename(structure,
    file => {
      let fileName = file.file;
      if (isJS(file)) {
        if (isReact(file)) {
          if(isClassDefaultExported(file)){
            fileName = nameAsExport(file)
          }
          fileName = toJSX(fileName);
        }

        fileName = toCamelCase(fileName);
        if (isClassDefaultExported(file) || isHOC(file)) {
          fileName = startsFromCapital(fileName);
        } else {
          fileName = startsFromLower(fileName);
        }
        fileName = keepIndex(fileName)
        return fileName;
      }
      return null;
    }
  );

  const imported = resolveImports(renamed, {
    '/': root,
    ...aliases
  });

  const result = rewireImports(applyAliases(toRelative(renameImports(imported)), aliases, true));

  console.log(result);
  //writeContent(result);
  //gitRenameAsync(result);
}

