/* @flow */

import type {
  GraphQLObjectType,
  GraphQLInterfaceType,
} from 'graphql';

import type Registry from '../Registry';
import type { specAST } from './astTypes';

import parser from '../parsers/parser';

import buildInterface from './buildInterface';
import buildType from './buildType';


export default function build(registry: Registry, spec: string, resolvers: Object): [GraphQLObjectType | GraphQLInterfaceType, string]  {
  const ast: specAST = parser.parse(spec);

 if (ast['type'] === 'type') {
    return [buildType(registry, ast, resolvers), ast['type']];
  } else if (ast['type'] === 'interface') {
    let resolveType;

    if (typeof resolvers === 'function') {
      resolveType = resolvers;
    } else {
      resolveType = resolvers[0];
    }

    return [buildInterface(registry, ast, resolveType), ast['type']];
  }

  throw new Error('Invalid type definition');
}
