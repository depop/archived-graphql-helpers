import test from 'ava';

import Registry from '../Registry';


test(`An type can reference another type`, async t => {
  const registry = new Registry();

  registry.create(`
    type Category {
      id: ID!
      name: String!
      slug: String
    }
  `);

  const productType = registry.create(`
    type Product {
      id: ID!
      title: String
      price: Float
      category: Category
    }
  `);

  const fields = productType._typeConfig.fields();

  t.is(Object.keys(fields).length, 4);
});


test(`An type can reference arrays of another type`, async t => {
  const registry = new Registry();

  registry.create(`
    type Category {
      id: ID!
      name: String!
      slug: String
    }
  `);

  const productType = registry.create(`
    type Product {
      id: ID!
      title: String
      price: Float
      category: [Category]
    }
  `);

  const fields = productType._typeConfig.fields();

  t.is(Object.keys(fields).length, 4);
});
