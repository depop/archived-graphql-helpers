/* @flow */

import {
  toGlobalId,
  fromGlobalId,
} from 'graphql-relay';

export const globalId =
  (fn) =>
  (obj, args, context, info) => {
    if (typeof fn === 'function') {
      return toGlobalId(info.parentType.name, fn(obj));
    } else if (typeof fn === 'string') {
      return toGlobalId(info.parentType.name, obj[fn]);
    }
    return toGlobalId(info.parentType.name, obj[info.fieldName]);
  };

export const unpackId = (input) => {
  if (!input) {
    return null;
  }
  const { id } = fromGlobalId(input);
  return id ? id : null;
};

export const unmask = (...fields) =>
  (executorFn) =>
  (input, context) => executorFn({
    ...input,
    ...fields.reduce((prev, field) => {
      const val = typeof field === 'function'
        ? field(input)
        : {[field]: unpackId(input[field])};

      return {
        ...prev,
        ...val,
      };
    }, {}),
  }, context);

unmask.array = (...fields) =>
  (input) => fields.reduce((prev, field) => ({
    ...prev,
    [field]: input[field].map(id => unpackId(id)),
  }), {});
