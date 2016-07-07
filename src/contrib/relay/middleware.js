import type { GraphQLFieldConfigMap } from 'graphql/type/definition';

import { globalId } from './resolvers';

import type { Thunk } from '../../functools';
import { resolveThunk } from '../../functools';


export default ({
  wrapInputType(obj) {
    return obj;
  },

  wrapInputTypeFields() {

  },

  wrapType() {

  },

  wrapTypeFields(fieldThunk: Thunk): GraphQLFieldConfigMap {
    /*
    1. Wraps all ID fields with Relay's globalId
    */
    const fields = resolveThunk(fieldThunk);

    return Object.keys(fields).reduce((previous, key) => {
      const field = fields[key];
      let resolve = field.resolve;

      if (field.type.ofType && field.type.ofType.name === 'ID') {
        resolve = globalId(key);
      }

      return {
        ...previous,
        [key]: {
          ...field,
          resolve,
        },
      };
    }, {});
  },
});
