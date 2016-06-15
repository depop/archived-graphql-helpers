/* @flow */

export default function injectResolvers(resolvers, fieldFunc) {
  if (typeof resolvers === 'undefined') {
    resolvers = {};
  }

  return function() {
    const fields = fieldFunc();

    return Object.keys(fields).reduce((previous, key) => {
      const field = fields[key];

      return {
        ...previous,
        [key]: {
          ...field,
          resolve: resolvers[key] || field.resolve,
        },
      };
    }, {});
  };
}
