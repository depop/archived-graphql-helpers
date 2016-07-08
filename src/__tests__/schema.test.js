import test from 'ava';

import {
  GraphQLSchema,
} from 'graphql';

import Registry from '../Registry';

test(`A schema can be created`, async () => {
  const registry = new Registry();

  registry.createType(`
    type Category {
      id: ID!
      name: String!
      slug: String
    }
  `);

  registry.createType(`
    type Product {
      id: ID!
      title: String
      price: Float
      category: [Category]
    }
  `);

  registry.createType(`
    type Query {
      product(id: Int! = a): Product
      products: [Product]
    }
  `);

  new GraphQLSchema({
    query: registry.getType('Query'),
  });
});
