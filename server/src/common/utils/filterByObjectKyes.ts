export const filterByObjectKeys = (reqQuery: any, keys: string[]) => {
  const queryList = Object.entries(reqQuery).filter(([k, v]) => keys.includes(k));
  return Object.fromEntries(queryList);
};
