import { GraphQLObjectType } from 'graphql';
import { resolveThunk } from '../functools';

export default function mergeTypes(name, ...types) {
  return new GraphQLObjectType({
    name,
    fields: () => {
      const resolvedFields = types.map(t => resolveThunk(t._typeConfig.fields));
      return resolvedFields.reduce((prev, fields) => ({
        ...prev,
        ...fields,
      }), {});
    },
  });
}
