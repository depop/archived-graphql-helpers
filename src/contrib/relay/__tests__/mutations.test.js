import test from 'ava';

import { GraphQLSchema } from 'graphql';

import Registry from '../../../Registry';
import middleware from '../middleware';

test(`Relay Middleware`, async () => {
  const registry = new Registry(middleware);

  registry.createType(`
    type BuyProductPayload {
      transactionID: ID!
      message: String!
    }
  `);

  registry.createMutations(`
    type MyMutations {
      buyProduct(productId: ID!, userId: ID!): BuyProductPayload
    }
  `, {
    buyProduct: () => null,
  });
});


test(`Relay Schema`, async () => {
  const registry = new Registry(middleware);

  registry.createType(`
    type User {
      username: String!
    }
  `);

  registry.createType(`
    type Query {
      user(username: String!): User
    }
  `);

  registry.createType(`
    type LoginPayload {
      token: String!
    }
  `);

  registry.createMutations(`
    type AuthMutations {
      login(username: String!, password: String!): LoginPayload
    }
  `, {
    login: ({username, password}) => ({
      token: `A super secure token ${username}/${password}`,
    }),
  });

  new GraphQLSchema({
    query: registry.getType('Query'),
    mutation: registry.getMutationType(),
  });
});
