export const toGit = names => (
  names
    .map(({file, rename}) => `git mv ${file} ${rename}`)
    .join('\n')
);
