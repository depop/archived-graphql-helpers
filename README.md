# GraphQL Helpers

A set of utilities for making it easier to work with `graphql-js`.

* Allows creation of types and interfaces via the GraphQL schema syntax
* Generic resolvers and resolver decorators for common use cases.

## Installation

```
npm install --save graphql-helpers
```

## Basic usage

```javascript
import { GraphQLSchema } from 'graphql';
import { Registry } from 'graphql-helpers';

const registry = new Registry();

registry.createType(`
  type BlogEntry {
    id: ID!
    title: String
    slug: String
    content: String
  }
`;

registry.createType(`
  type Query {
    blogEntry(slug: String!): BlogEntry
    blogEntries: [BlogEntry]
  }
`, {
  blogEntry: /* resolver */,
  blogEntries: /* resolver */,
};

const schema = new GraphQLSchema({
  query: registry.getType('Query'),
});
```

If you have any types defined using the underlying `graphql-js` library you can add them to the registry using `registry.addType(type: GraphQLObjectType)` and `registry.addInterface(interface: GraphQLIntefaceType)`. You can use types from the registry with `registry.getType(name: String)`, which will allow you to incrementally adopt this pattern. To use a type from the registry in a vanilla `graphql-js` type you should use a thunk for the fields to avoid any issues with types that haven't yet been registered.


## Splitting your schema into modules.

If you want to split your types up into modules (as you probably should), to avoid having to manually import each one, you can cheat. There's a babel plugin called `babel-plugin-import-glob` which lets you define a glob pattern of modules to bulk import.

### Example

```javascript
// Category.graphql.js

export default (registry) => {
  registry.createType(`
    type Category {
      id: ID!
      title: String
      slug: String
    }
  `;
}
```

```javascript
// Product.graphql.js

export default (registry) => {
  registry.createType(`
    type Product {
      id: ID!
      title: String
      description: String
      price: String
      currency: String
      categories: [Category]
    }
  `, {
    categories: /* resolver */,
  };
}
```

```javascript
// Query.graphql.js

export default (registry) => {
  registry.createType(`
    type Query {
      product(id: ID!): Product
      products: [Product]
    }
  `, {
    product: /* resolver */,
    products: /* resolver */,
  })
}
```

```javascript
// schema.js

import { GraphQLSchema } from 'graphql';
import { Registry } from 'graphql-helpers';

/* babel-plugin-import-glob turns this into the full list of modules, works with webpack */
import * as graphQLModules from 'glob:./**/*.graphql.js';

const registry = new Registry();

/* Initialize modules */
Object.keys(graphQLModules).map(key => graphQLModules[key](registry));

const schema = new GraphQLSchema({
  query: registry.getType('Query'),
});
```

## Generic resolvers and resolver decorators

Certain types of resolver functions often get reused heavily, particularly field aliasing, so they're available to use in a generic form:

```javascript
import { GraphQLSchema } from 'graphql';
import { Registry } from 'graphql-helpers';
import { alias, globalId } from 'graphql-helpers/lib/resolvers/generic';
import { use, logInput, logResult, timer } from 'graphql-helpers/lib/resolvers/decorators';

import { getUser } from '../userService';

const registry = new Registry();

registry.createType(`
  type BlogEntry {
    id: ID!
    title: String
    slug: String
    content: String
    publicationDate: Date
    author: User
  }
`, {
  id: globalId('id'),
  publicationDate: alias('publication_date'),
  author: use(timer('Fetching author'), logResult)(obj => getUser(obj.author_id)),
};
```

## Working with Relay

`graphql-helpers` was born out of the requirements of existing Relay-based codebases, so it's important that building for Relay's specific schema requirements is as straightforward as possible.  We achieve this by using a system of middleware.  Middleware allows a `Registry` to run post-processing steps on the schema types that its given, in the case of the Relay middleware, it does 2 things:

1. Automatically creates a resolve function for `ID` field types that generates a suitable Global ID for use with Relay nodes.

2. Automatically converts mutation field arguments into a Relay-compatible Input type, and adds a `clientMutationId` field to both the input and output payload.

### Example of Relay-compatible schema definition

```javascript
import {
  GraphQLSchema,
} from 'graphql';

import { Registry } from 'graphql-helpers';
import { middleware } from 'graphql-helpers/lib/contrib/relay';

const registry = new Registry(middleware);

registry.createInterface(`
  interface Node {
    id: ID!
  }
`);

registry.createType(`
  type User implements Node {
    id: ID!
    username: String!
  }
`);

registry.createType(`
  type Query {
    user(id: ID, username: String): User
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
```

We also provide helper functions to make it easy to retrieve the underlying ID values when global IDs are used in a mutation input:

```javascript
  import { unmask } from 'graphql-helpers/lib/contrib/relay';
  import updateEvent from './updateEvent';

  registry.createType(`
    type UpdateEventPayload {
      event: Event
    }
  `);

  const eventArgs = `
    id: ID!
    name: String!
    startDatetime: Datetime!
    endDatetime: Datetime!
    description: String
    venueId: String!
    tagIds: [String]
  `;

  registry.createMutations(`
    type EventMutations {
      updateEvent(${eventArgs}): UpdateEventPayload
    }
  `, {
    updateEvent: unmask('id', 'venueId', unmask.array('tagIds'))(updateEvent),
  });
```
