/* @flow */

import type {
  GraphQLObjectType,
  GraphQLInterfaceType,
} from 'graphql';

import { parse } from 'graphql';

import type Registry from '../Registry';

import buildInterface from './buildInterface';
import buildType from './buildType';

import type { ResolverFn, ResolveTypeFn } from '../resolvers/types';

export default function build(registry: Registry, spec: string, resolvers: ?{[name: string]: ResolverFn} | ResolveTypeFn): [GraphQLObjectType | GraphQLInterfaceType, string]  {
  const documentAst = parse(spec);

  if (documentAst.definitions.length !== 1) {
    throw new Error(`Documents must contain exactly one definition (found: ${documentAst.definitions.length})`);
  }

  const definition = documentAst.definitions[0];

  if (definition['kind'] === 'ObjectTypeDefinition') {
    return [buildType(registry, definition, resolvers), 'ObjectTypeDefinition'];
  } else if (definition['kind'] === 'InterfaceTypeDefinition') {
    if (!typeof resolvers === 'function') {
      throw new Error('Interfaces must have a type resolve function');
    }
    return [buildInterface(registry, definition, resolvers), 'InterfaceTypeDefinition'];
  }

  throw new Error('Invalid type definition');
}
