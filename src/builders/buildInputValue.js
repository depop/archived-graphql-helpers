/* @flow */

import type { GraphQLObjectType }from 'graphql';

import type {
  InputValueDefinition,
} from 'graphql/language';

import type Registry from '../Registry';

import getType from './getType';


export default function buildInputValue(registry: Registry, inputValueDefinition: InputValueDefinition): {[name: string]: GraphQLObjectType} {
  return {
    [inputValueDefinition['name']['value']]: {
      type: getType(registry, inputValueDefinition.type),
    },
  };
}
