import { m } from "./util.mjs";
import { makeSuite, assertIs, spy } from "./test-util.mjs";

export const deepEqualsTests = makeSuite([
  // Don't use assetEquals here, that uses deepEquals

  assertIs(
    'deepEquals() handles non-equal types',
    () => deepEquals(1, 2),
    false
  ),

  assertIs(
    'deepEquals() handles basic equal types',
    () => deepEquals(1, 1),
    true
  ),

  assertIs(
    'deepEquals() handles non-equal objects',
    () => deepEquals({ foo: 1 }, { foo: 2 }),
    false
  ),

  assertIs(
    'deepEquals() handles equal objects',
    () => deepEquals({ foo: 1 }, { foo: 1 }),
    true
  ),

  assertIs(
    'deepEquals() handles nested objects',
    () => deepEquals({
      foo: {
        bar: {
          baz: 2,
          bit: 1
        }
      }
    }, {
      foo: {
        bar: {
          bit: 1,
          baz: 2
        }
      }
    }),
    true
  ),

  assertIs(
    'deepEquals() handles non-equal arrays',
    () => deepEquals([1, 2], [2, 1]),
    false
  ),

  assertIs(
    'deepEquals() handles equal arrays',
    () => deepEquals([1], [1]),
    true
  ),

  assertIs(
    'deepEquals() handles nested arrays',
    () => deepEquals([
      ['foo', 'bar', 'baz'],
      [1, 2, 3]
    ], [
      ['foo', 'bar', 'baz'],
      [1, 2, 3]
    ]),
    true
  ),

  assertIs(
    'deepEquals() handles nested object arrays',
    () => deepEquals({
      foo: [1, 2, 3],
      bar: 'foo'
    }, {
      bar: 'foo',
      foo: [1, 2, 3]
    }),
    true
  ),

  assertIs(
    'deepEquals() handles nested array objects',
    () => deepEquals([
      { foo: 1 },
      { bar: 2 }
    ], [
      { foo: 1 },
      { bar: 2 }
    ]),
    true
  )
]);

export const mTests = makeSuite([
  assertIs(
    "m() calls initially",
    () => {
      const spied = spy(() => {});
      const fn = m(spied);
      fn();
      return spied.intel.length;
    },
    1
  ),

  assertIs("m() returns correctly", () => m(() => "FOOBAR")(), "FOOBAR"),

  assertIs(
    "m() memoizes with no args",
    () => {
      const spied = spy(() => {});
      const fn = m(spied);
      fn();
      fn();
      return spied.intel.length;
    },
    1
  ),

  assertIs(
    "m() memoizes with 1 arg",
    () => {
      const spied = spy(() => {});
      const fn = m(spied);
      fn(1);
      fn(1);
      return spied.intel.length;
    },
    1
  ),

  assertIs(
    "m() memoizes with multiple args",
    () => {
      const spied = spy(() => {});
      const fn = m(spied);
      fn(1, 2);
      fn(1, 2);
      return spied.intel.length;
    },
    1
  ),

  assertIs(
    "m() unmemoizes 1",
    () => {
      const spied = spy(() => {});
      const fn = m(spied);
      fn(1);
      fn(2);
      return spied.intel.length;
    },
    2
  ),

  assertIs(
    "m() unmemoizes with multiple orgs",
    () => {
      const spied = spy(() => {});
      const fn = m(spied);
      fn(1, 2);
      fn(1, 3);
      return spied.intel.length;
    },
    2
  )
]);
