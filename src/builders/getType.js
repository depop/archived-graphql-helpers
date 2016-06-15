/* @flow */

import {
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';

import type GraphQLObjectType from 'graphql';
import type Registry from '../Registry';

export default function getType(registry: Registry, typeName: string, isList: boolean, isRequired: boolean): GraphQLObjectType {
  let type;

  if (isList) {
    type = new GraphQLList(registry.getType(typeName));
  } else {
    type = registry.getType(typeName);
  }

  if (isRequired) {
    type = new GraphQLNonNull(type);
  }

  return type;
}
