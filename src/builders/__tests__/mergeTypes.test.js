import test from 'ava';

import Registry from '../../Registry';
import mergeTypes from '../mergeTypes';

test(`Two types can be merged`, async t => {
  const registry = new Registry();

  const typeA = registry.buildType(`
    type A {
      a: String
    }
  `);

  const typeB = registry.buildType(`
    type B {
      b: Int
    }
  `);

  const typeC = mergeTypes('C', typeA, typeB);

  t.deepEqual(['a', 'b'], Object.keys(typeC._typeConfig.fields()));
});
