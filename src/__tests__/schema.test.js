import test from 'ava';

import {
  GraphQLSchema,
} from 'graphql';

import Registry from '../Registry';


test(`A schema can be created`, async () => {
  const registry = new Registry();

  registry.create(`
    type Category {
      id: ID!
      name: String!
      slug: String
    }
  `);

  registry.create(`
    type Product {
      id: ID!
      title: String
      price: Float
      category: [Category]
    }
  `);

  registry.create(`
    type Query {
      product(id: Int!): Product
      products: [Product]
    }
  `);

  new GraphQLSchema({
    query: registry.getType('Query'),
  });
});
