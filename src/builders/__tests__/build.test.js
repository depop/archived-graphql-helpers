import test from 'ava';

import Registry from '../../Registry';
import build from '../build';


test(`An empty type can be built`, async t => {
  const [newType, typeKind] = build(new Registry(), `
    type Empty {}
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 0);
  t.is(typeKind, 'type');
});


test(`An type with a single ID field can be built`, async t => {
  const [newType, typeKind] = build(new Registry(), `
    type Simple {
      id: ID!
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
  t.is(typeKind, 'type');
});


test(`An type with a several fields can be built`, async t => {
  const [newType, typeKind] = build(new Registry(), `
    type Product {
      id: ID!
      title: String
      price: Float
      tags: [String]
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 4);
  t.is(typeKind, 'type');
});
