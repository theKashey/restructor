import {readFile} from 'fs';

export const getFileContent = file => (
  new Promise((resolve, reject) =>
    readFile(file, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  )
);