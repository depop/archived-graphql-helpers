/* @flow */

import type { ResolverFn } from '../resolvers/types';
import type { Thunk } from '../functools';
import { resolveThunk } from '../functools';

import type { GraphQLFieldConfigMap } from 'graphql/type/definition';

export default function injectResolversMiddleware(resolvers: {[field: string]: ResolverFn}) {
  return (fieldThunk: Thunk): GraphQLFieldConfigMap => {
    const fields = resolveThunk(fieldThunk);

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
