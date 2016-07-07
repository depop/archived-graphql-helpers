import test from 'ava';

import {
  toGlobalId,
} from 'graphql-relay';

import Registry from '../../../Registry';
import middleware from '../middleware';

test(`Relay Middleware`, async t => {
  const registry = new Registry(middleware);

  const Category = registry.create(`
    type Category {
      id: ID!
      name: String!
      slug: String
    }
  `);

  const idResolver = Category._typeConfig.fields()['id'].resolve;

  const expected = toGlobalId('Category', '1');
  const actual = idResolver({id: '1'}, {}, {}, {parentType:{name: 'Category'}});

  t.is(expected, actual);
});
