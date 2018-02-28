RE-STRUCTOR
=====

It could:
 - make all file names camelCase
 - make all file names snake-case 
 - rename all React sources to `jsx`
 - and name them from Capital letter, as long they export Class
 - or name from lower, if not. Why not?
 - add `aliases` to code base
 - remove `aliases` from code base
 - move a file to a new position
 
And it this same time:
 - it will use `git mv` to __rename__ the file. Maintaining history.
 - it will __update all the usages__ from just renamed file.
 
It will help you __RESTRUCTURE__ your codebase.

# API 
```js
// the main
import restructor from 'restructor';
import {toGit} from 'restructor/versionControl';
import {isJS} from 'restructor/types';
import {isReact, toJSX, isHOC} from "restructor/React";
import {startsFromLower, startsFromCapital, toSnakeCase, toCamelCase} from "restructor/letterCase";
import {isClassDefaultExported} from "restructor/exports";
import {applyAliases, toRelative, renameImports, resolveImports, rewireImports} from 'restructor/imports'
```
#### index
- `structure = await restructor(root)` - generates the structure
- `structure = rename(structure, callback)` - renames the files by the rule
- `async writeContent(structure)` - writes content back to files
* where `structure` is array of `file`.
#### versionControl
- `const structure = await gitRenameAsync(structure)` - flushes the commands into GIT
#### React
- `isJS(file), isCSS(file)` - returns a file type. (.ts is also js)
- `isReact(file)` - true, if file contain JSX.
- `isHOC(file, additionalSignatures=[])` - true, if HOC is exported as default export.
- `toJSX(fileName)` - rename file to jsx(or tsx).
#### letterCase
- `startsFromLower(fileName)/startsFromCapital` - changes file signature. 
- `toSnakeCase(fileName)/toCamelCase` - changes file signature.
#### exports
- `isClassDefaultExported(file)` - true, if class is exported as default export.
- `nameAsExport(file)` - use default exported Component name as name.
#### imports
`resolveImports(structure, aliases)` - main module function, fills the imports information.
`rewireImports(structure)` - main module function, flushes the changes back
`renameImports(structure)` - applies module renames (already done in resolveImports)

`toRelative(structure)` - converts all paths to relative
`applyAliases(structure, aliases)` - applies aliases where possible.



 
# Example