/* @flow */

import type { ResolverFn } from '../resolvers/types';

type FieldThunk = () => Object;

export default function injectResolvers(resolvers: {[field: string]: ResolverFn}, fieldThunk: FieldThunk): FieldThunk {
  if (typeof resolvers === 'undefined') {
    resolvers = {};
  }

  return () => {
    const fields = fieldThunk();

    return Object.keys(fields).reduce((previous, key) => {
      const field = fields[key];

      return {
        ...previous,
        [key]: {
          ...field,
          resolve: resolvers[key] || field.resolve,
        },
      };
    }, {});
  };
}
