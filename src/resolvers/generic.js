/* @flow */

import {
  toGlobalId,
} from 'graphql-relay';

const alias =
  (name) =>
  (obj) => obj[name];

const globalId =
  (fn) =>
  (obj, args, context, info) => toGlobalId(info.parentType.name, fn(obj));


export {
  alias,
  globalId,
};
