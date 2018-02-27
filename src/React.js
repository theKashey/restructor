import {isEXT} from "./types";

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