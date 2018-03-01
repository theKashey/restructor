import {extname, parse} from 'path';

export const isEXT = (ext, file) => ext.indexOf(extname(file)) >= 0;
export const isContain = (parts, file) => parts.some(part => file.indexOf(part) >= 0);


export const isJS = ({file}) => isEXT(['.ts', '.tsx', '.js', '.jsx'], file) && file.indexOf('d.ts') === -1;
export const isTest = ({file}) => isContain(['.spec.', '.test.'], file) && file.indexOf('d.ts') === -1;
export const isCSS = ({file}) => isEXT(['.css', '.less', '.sass'], file);
export const isImage = ({file}) => isEXT(['.png', '.jpg', '.jpeg', '.svg'], file);