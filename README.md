# GraphQL Helpers

**Not installable yet, so this readme is more of a sneak peak.**

Basic usage:

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

If you want to split your types up into modules (as you probably should), to avoid having to manually import each one, you can cheat. There's a babel plugin called `babel-plugin-import-glob` which lets you define a glob pattern of modules to bulk import. So if all your
GraphQL types are defined in modules using a naming convention such as `*.graphql.js`, you can import them all with `import 'glob:./**/*.graphql.js';`. Each module can import a global registry module (yuck), and doesn't need to declare any exports (also yuck).
