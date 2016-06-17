import test from 'ava';

import Registry from '../../Registry';
import build from '../build';


test(`An empty type can be built`, async t => {
  const [newType, typeKind] = build(new Registry(), `
    type Empty {}
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 0);
  t.is(typeKind, 'ObjectTypeDefinition');
});


test(`A type can have optional fields`, async t => {
  const [newType, typeKind] = build(new Registry(), `
    type Simple {
      id: ID
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
  t.is(typeKind, 'ObjectTypeDefinition');
});

test(`A field can have a custom resolver`, async t => {
  const [newType,,] = build(new Registry(), `
    type Simple {
      id: ID
      title: String
    }
  `, {
    id: obj => obj.foo,
  });

  const fields = newType._typeConfig.fields();

  t.is(typeof fields['id']['resolve'], 'function');
  t.is(typeof fields['title']['resolve'], 'undefined');
});

test(`A field can have input arguments`, async t => {
  const [newType, typeKind] = build(new Registry(), `
    type Simple {
      id(foo: String): ID
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
  t.is(typeKind, 'ObjectTypeDefinition');
});

test(`A field can have multiple input arguments`, async t => {
  const [newType, typeKind] = build(new Registry(), `
    type Simple {
      id(foo: String!, bar: [ID]): ID
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
  t.is(typeKind, 'ObjectTypeDefinition');
});

test(`A type can have required fields`, async t => {
  const [newType, typeKind] = build(new Registry(), `
    type Simple {
      id: ID!
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
  t.is(typeKind, 'ObjectTypeDefinition');
});

test(`A type can have array fields`, async t => {
  const [newType, typeKind] = build(new Registry(), `
    type Simple {
      ids: [ID]
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
  t.is(typeKind, 'ObjectTypeDefinition');
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
  t.is(typeKind, 'ObjectTypeDefinition');
});



test(`An interface can be built`, async t => {
  const [newType, typeKind] = build(new Registry(), `
    interface Node {
      id: ID!
    }
  `);

  const fields = newType._typeConfig.fields();

  t.is(Object.keys(fields).length, 1);
  t.is(typeKind, 'InterfaceTypeDefinition');
});
