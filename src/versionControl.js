import {sep} from 'path';
import {mkdir} from 'fs'
import {promisify} from './lib/utils';
import {exec} from 'child_process';


const pDir = promisify(mkdir, null, true);
const pExec = promisify(exec);


async function ensurePathExists(path, lookup) {
  const parts = path.split(sep);
  parts.pop();

  const commands = [];
  let currentPath = '';

  for (let dir of parts) {
    currentPath = currentPath + dir;
    if (!lookup[currentPath]) {
      lookup[currentPath] = true;
      commands.push(pDir(currentPath));
    }
    currentPath += sep;
  }

  await Promise.all(commands);
}

export async function gitRenameAsync(names) {
  const renames = names.filter(({file, rename}) => !!rename && rename !== file);
  const lookup = {};
  await Promise.all(renames.map(({rename}) => ensurePathExists(rename, lookup)));
  const cmds = renames.map(({file, rename}) => `git mv ${file} ${rename}`);

  for (let cmd of cmds) {
    console.log(cmd);
    try {
      await pExec(cmd);
    } catch (e) {
      console.error(e);
    }
  }
}