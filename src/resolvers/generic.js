/* @flow */

import {
  toGlobalId,
} from 'graphql-relay';

const alias =
  (name) =>
  (obj) => obj[name];

const globalId =
  (fn) =>
  (obj, args, context, info) => {
    if (typeof fn === 'function') {
      return toGlobalId(info.parentType.name, fn(obj));
    } else if (typeof fn === 'string') {
      return toGlobalId(info.parentType.name, obj[fn]);
    }
    return toGlobalId(info.parentType.name, obj[info.fieldName]);
  };

export {
  alias,
  globalId,
};
