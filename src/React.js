import {isEXT} from "./types";

export const defaultHOCs = [
  'connect',
  'hot',
  'class'
];

export const toJSX = (file) => {
  if (isEXT(['.tsx', '.jsx'], file)) {
    return file;
  }
  if (isEXT(['.ts', '.js'], file)) {
    return file + 'x';
  }
  return file;
};

export const isReact = ({content}) => content.indexOf('React') >= 0 && content.indexOf('/>') >= 0;

export const isHOC = ({content}, HOCs = []) => {
  const match = content.match(/export default (\w+)/i);
  return match && [...HOCs,...defaultHOCs].indexOf(match[1]) >= 0;
};