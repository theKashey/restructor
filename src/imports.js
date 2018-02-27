const getDynamicImports = str => (
  str
    .match(/import\((\w+)\)/g)
    .map(statement => ({
      statement,
      file: statement.map(/import\((\w+)\)/i)[1]
    }))
);

const getStaticImports = str => (
  str
    .match(/import (.*) from (\w+)/g)
    .map(statement => ({
      statement,
      file: statement.map(/import (.*) from (\w+)/i)[2]
    }))
);

export const getImports = (content) => [...getStaticImports(content), ...getDynamicImports(content)];

