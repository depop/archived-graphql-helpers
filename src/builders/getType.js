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
      return registry.getType(type.name.value);
    case 'ListType':
      return new GraphQLList(getType(registry, type.type));
    case 'NonNullType':
      return new GraphQLNonNull(getType(registry, type.type));
    default:
      return null;
  }
}
