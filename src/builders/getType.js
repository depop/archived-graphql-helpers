/* @flow */

import {
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';

import type {
  Type,
  GraphQLType,
} from 'graphql/language';

import type Registry from '../Registry';

export default function getType(registry: Registry, type: Type): ?GraphQLType {
  switch (type.kind) {
    case 'NamedType':
      const foundType = registry.getType(type.name.value);

      if (!foundType) {
        throw new Error(`Error building schema, couldn't find type: ${type.name.value}`);
      }

      return foundType;
    case 'ListType':
      return new GraphQLList(getType(registry, type.type));
    case 'NonNullType':
      return new GraphQLNonNull(getType(registry, type.type));
    default:
      return null;
  }
}
