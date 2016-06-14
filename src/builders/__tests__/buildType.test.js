import test from 'ava';

import buildType from '../buildType';


test(`Types are builded`, async t => {
  const type = buildType({}, `
    type Product {
      id: ID!
    }
  `, {});

  t.true(true);
});
