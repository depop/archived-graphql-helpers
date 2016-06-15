# GraphQL Helpers

**Not installable yet, so this readme is more of a sneak peak.**

## Basic usage

```javascript
import { Registry } from `graphql-helpers`;

const registry = new Registry();

registry.createType(`
  type Category {
    id: ID!
    title: String
    slug: String
  }
`;

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
  categories: (obj, args) => /* resolver */,
};

registry.createType(`
  type Viewer implements Node {
    id: ID!
    product(id: ID!): Product
    products(): [Product]]
  }
`, {
  product: (obj, args) => /* resolver */,
  products: (obj, args) => /* resolver */,
};    
```

You can use this alongside manually-defined types using `registry.getType(/* name */)`. But make sure all your fields are defined inside thunks, otherwise you'll hit the usual circular import problem.

## Splitting your schema into modules.

If you want to split your types up into modules (as you probably should), to avoid having to manually import each one, you can cheat. There's a babel plugin called `babel-plugin-import-glob` which lets you define a glob pattern of modules to bulk import.

### Example

```javascript
// Category.type.js

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
// Product.type.js

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
// Query.type.js

export default (registry) => {
  registry.create(`
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
