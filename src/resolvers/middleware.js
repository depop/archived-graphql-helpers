/* @flow */

import { compose as use } from '../functools';

const logInput =
  (fn) =>
  (obj, args, context, info) => {
    console.log({
      obj,
      args,
      context,
      info,
    });
    return fn(obj, args, context, info);
};

const logResult =
  (fn) =>
  async (obj, args, context, info) => {
    try {
      const result = await fn(obj, args, context, info);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
};

const timer =
  (name: String) =>
  (fn) =>
  async (obj, args, context, info) => {
    const start = new Date().getTime();

    try {
      return await fn(obj, args, context, info);
    } finally {
      const end = new Date().getTime();
      console.log(`Timer ${name} took: ${end - start}ms`);
    }
  };

export {
  use,
  timer,
  logInput,
  logResult,
};
