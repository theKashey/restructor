import restructor from '../index';
import {toGit} from '../versionControl';
import {isJS} from '../types';
import {isReact, toJSX} from "../React";
import {startsFromLower, startsFromCapital, toSnakeCase, toCamelCase} from "../letterCase";
import {isClassDefaultExported} from "../exports";

async function structure() {

  const structure = await restructor(
    '/Users/akorzunov/dev/Z/mellis/github/utils/restate',
    file => {
      let fileName = file.file;
      if (isJS(file)) {
        if (isReact(file)) {
          fileName = toJSX(fileName);
        }

        fileName = toSnakeCase(fileName);
        if (!isClassDefaultExported(file)) {
          fileName = startsFromLower(fileName);
        } else {
          fileName = startsFromCapital(fileName);
        }
        return fileName;
      }
      return null;
    }
  );

  console.log(toGit(structure));
}

structure();