/* @flow */

import type { GraphQLObjectType }from 'graphql';

import type {
  FieldDefinition,
  InputValueDefinition,
} from 'graphql/language';

import getType from './getType';

import type Registry from '../Registry';

import buildInputValue from './buildInputValue';

type FieldType = {
  type: GraphQLObjectType,
  args: Array<any>,
};

type BuiltFieldType =  {[name: string]: FieldType};


export default function buildField(registry: Registry, fieldDefinition: FieldDefinition): BuiltFieldType {
  const fieldType = fieldDefinition.type;

  const args = fieldDefinition['arguments'].reduce((previous: Object, inputValueDefinition: InputValueDefinition) => {
    return {
      ...previous,
      ...buildInputValue(registry, inputValueDefinition),
    };
  }, {});

  const field = {
    type: getType(registry, fieldType),
    description: null,
    args,
  };

  return {
    [fieldDefinition['name']['value']]: field,
  };
}
