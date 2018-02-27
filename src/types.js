import {extname} from 'path';

export const isEXT = (ext, file) => ext.indexOf(extname(file)) >= 0;
export const isJS = ({file}) => isEXT(['.ts', '.tsx', '.js', '.jsx'], file) && file.indexOf('d.ts') === -1;
export const isCSS = ({file}) => isEXT(['.css', '.less', '.sass'], file);