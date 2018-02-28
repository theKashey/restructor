export const isClassDefaultExported = ({content}) => {
  const match = content.match(/export default (\w)/i);
  return match && match[1] === match[1].toUpperCase()
};

export const nameAsExport = ({content}) => {
  const match = content.match(/export default (\w+)/i);
  return match && match[1];
};