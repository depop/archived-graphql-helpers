/* @flow */

export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  const last = funcs[funcs.length - 1];
  return (...args) => {
    let result = last(...args);
    for (let index = funcs.length - 2; index >= 0; index--) {
      const fn = funcs[index];
      result = fn(result);
    }
    return result;
  };
}
