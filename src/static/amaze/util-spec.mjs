import { makeSuite, assertIs, spy } from './test-util.mjs';

export const run = makeSuite([
  assertIs(
    'm() calls initially',
    () => {
      const fn = spy(m(() => symbol()));
      fn();
      return fn.callCnt;
    },
    1
  )
]);
