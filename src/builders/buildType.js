import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';

import {
  globalIdField,
} from 'graphql-relay';

import injectResolvers from '../injectResolvers';

import parser from '../parsers/typeParser';


function getType(registry, typeName, isList, isRequired) {
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


export default function buildType(registry, spec, resolvers, description: ?string) {
  const ast = parser.parse(spec);

  const interfaces = ast['implements'].map(name => registry.getInterface(name));
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

  const newType = new GraphQLObjectType({
    name: ast['name'],
    fields: injectResolvers(resolvers, buildFields),
    interfaces,
  });

  return newType;
}
