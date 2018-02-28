"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const isClassDefaultExported = exports.isClassDefaultExported = ({ content }) => {
  const match = content.match(/export default (\w)/i);
  return match && match[1] === match[1].toUpperCase();
};

const nameAsExport = exports.nameAsExport = ({ content }) => {
  const match = content.match(/export default (\w+)/i);
  return match && match[1];
};