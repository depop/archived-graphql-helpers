/* @flow */

import {
  GraphQLInterfaceType,
} from 'graphql';

import {
  globalIdField,
} from 'graphql-relay';

import type Registry from '../Registry';
import type { specAST } from './astTypes';

import getType from './getType';


export default function buildInterface(registry: Registry, ast: specAST, resolveType): GraphQLInterfaceType {
  const fields = ast['fields'];

  const buildFields = () => {
    return fields.reduce((previous, fieldSpec) => {
      const typeSpec = fieldSpec['type'];
      let field;

      const args = fieldSpec['args'].reduce((previous, argSpec) => {
        const arg = {
          type: getType(
            registry,
            argSpec['type']['name'],
            argSpec['type']['isList'],
            argSpec['required'],
          ),
        };

        return {
          ...previous,
          [argSpec['name']]: arg,
        };
      }, {});

      if (typeSpec['name'] === 'ID') {
        field = globalIdField(ast['name']);
      } else {
        const type = getType(
          registry,
          typeSpec['name'],
          typeSpec['isList'],
          fieldSpec['required'],
        );

        field = {
          type,
          args,
        };
      }

      return {
        ...previous,
        [fieldSpec['name']]: field,
      };
    }, {});
  };

  return new GraphQLInterfaceType({
    name: ast['name'],
    fields: buildFields,
    resolveType,
  });
}
