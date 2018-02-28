import {sep} from 'path';
import {mkdir} from 'fs'
import {promisify} from './lib/utils';
import {exec} from 'child_process';


const pDir = promisify(mkdir, null, true);
const pExec = promisify(exec);


async function ensurePathExists(path, lookup) {
  const parts = path.split(sep);
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
  const lookup = {};
  await Promise.all(names.map(({rename}) => ensurePathExists(rename, lookup)));
  await names
    .map(({file, rename}) => `git mv ${file} ${rename}`)
    .map(pExec)
}