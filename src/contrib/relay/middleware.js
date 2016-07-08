import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import type { GraphQLFieldConfigMap } from 'graphql/type/definition';

import { camelcase } from 'varname';

import { globalId } from './resolvers';

import type { Thunk } from '../../functools';
import { resolveThunk } from '../../functools';


function wrapMutationOutput(name, type) {
  const augmentedFields = () => ({
    ...resolveThunk(type._typeConfig.fields),
    clientMutationId: {
      type: new GraphQLNonNull(GraphQLString),
     },
  });

  return new GraphQLObjectType({
    name: `${camelcase(name)}Payload`,
    fields: augmentedFields,
    interfaces: type._typeConfig.interfaces,
  });
}

function inputTypeFromArgs(name, args) {
  return new GraphQLInputObjectType({
    name: `${camelcase(name)}Input`,
    fields: {
      ...args,
      clientMutationId: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
  });
}


export default ({
  wrapMutations(mutations) {
    const inputFields = mutations._typeConfig.fields;

    const augmentedInputFields = () => {
      const fields = resolveThunk(inputFields);

      return Object.keys(fields).reduce((prev, key) => {
        const field = fields[key];
        const augmentedField = {
          ...field,
          args: {
            input: {
              type: new GraphQLNonNull(inputTypeFromArgs(key, field.args)),
            },
          },
          type: wrapMutationOutput(key, field.type),
          resolve: (_, {input}, context, info) => {
            return Promise.resolve(field.resolve(input, context, info)).then(payload => {
              payload.clientMutationId = input.clientMutationId;
              return payload;
            });
          },
        };

        return {
          ...prev,
          [key]: augmentedField,
        };
      }, {});
    };

    mutations._typeConfig.fields = augmentedInputFields;
    return mutations;
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
