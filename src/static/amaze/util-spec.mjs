import { m } from './util.mjs';
import { makeSuite, assertIs, spy } from './test-util.mjs';

makeSuite([
  assertIs(
    'm() calls initially',
    () => {
      const spied = spy(() => {});
      const fn = m(spied);
      fn();
      return spied.intel.length;
    },
    1
  ),

  assertIs(
    'm() returns correctly',
    () => m(() => 'FOOBAR')(),
    'FOOBAR' 
  ),

  assertIs(
    'm() memoizes with no args',
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
    'm() memoizes with 1 arg',
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
    'm() memoizes with multiple args',
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
    'm() unmemoizes 1',
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
    'm() unmemoizes with multiple orgs',
    () => {
      const spied = spy(() => {});
      const fn = m(spied);
      fn(1, 2);
      fn(1, 3);
      return spied.intel.length;
    },
    2
  )
])();
