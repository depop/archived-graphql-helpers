/* @flow */

import {
  GraphQLObjectType,
} from 'graphql';

import type {
  FieldDefinition,
  ObjectTypeDefinition,
} from 'graphql/language';

import type Registry from '../Registry';

import type { ResolverFn } from '../resolvers/types';

import injectResolvers from './injectResolvers';

import buildField from './buildField';

export default function buildType(registry: Registry, definition: ObjectTypeDefinition, resolvers: {[name: string]: ResolverFn} = {}): GraphQLObjectType  {
  const interfaces = () =>
    definition['interfaces'].map(namedType => registry.getInterface(namedType['name']['value']));
  const fields = definition['fields'];

  const buildFields = () => {
    return fields.reduce((previous: Object, fieldDefinition: FieldDefinition) => {
      return {
        ...previous,
        ...buildField(registry, fieldDefinition),
      };
    }, {});
  };

  return new GraphQLObjectType({
    name: definition['name']['value'],
    fields: () => injectResolvers(resolvers, buildFields),
    interfaces,
  });
}
