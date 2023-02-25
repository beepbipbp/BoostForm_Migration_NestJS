export const pipe = (...functions) => {
  return (init) => functions.reduce((acc, currentFunction) => currentFunction(acc), init);
};
