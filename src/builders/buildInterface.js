/* @flow */

import {
  GraphQLInterfaceType,
} from 'graphql';

import type {
  FieldDefinition,
  InterfaceTypeDefinition,
} from 'graphql/language';

import type Registry from '../Registry';

import type { ResolveTypeFn } from '../resolvers/types';

import buildField from './buildField';


export default function buildInterface(
  registry: Registry,
  definition: InterfaceTypeDefinition,
  resolveType: ResolveTypeFn,
): GraphQLInterfaceType {
  const buildFields = () => {
    return definition['fields'].reduce((previous: Object, fieldDefinition: FieldDefinition) => {
      return {
        ...previous,
        ...buildField(registry, fieldDefinition),
      };
    }, {});
  };

  return new GraphQLInterfaceType({
    name: definition['name']['value'],
    fields: buildFields,
    resolveType,
  });
}
