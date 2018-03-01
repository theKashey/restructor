import {parse, join} from 'path';

export const isClassDefaultExported = ({content}) => {
  const match = content.match(/export default (\w)/i);
  return match && match[1] === match[1].toUpperCase()
};

export const nameAsExport = ({file, content}) => {
  const data = parse(file);
  const match = content.match(/export default (\w+)/i);
  if (match && match[1]) {
    return join(data.dir, match[1] + data.ext);
  } else {
    return file;
  }
};