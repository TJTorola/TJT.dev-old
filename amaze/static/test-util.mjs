// Who tests the test functions?
export const makeSuite = tests => () =>
  tests.reduce(
    (acc, test) =>
      // NOTE: this short-circuits later tests, maybe good?
      acc && test(),
    true
  );

export const assertEquals = (testDesc, leftFn, right) => () => {
  const left = leftFn();
  if (deepEquals(left, right)) {
    console.log(`PASSED: ${testDesc}`);
    return true;
  } else {
    console.error(`FAILED: ${testDesc}`);
    console.log({
      left,
      right
    });
    return false;
  }
};

export const assertIs = (testDesc, leftFn, right) => () => {
  const left = leftFn();
  if (left === right) {
    console.log(`PASSED: ${testDesc}`);
    return true;
  } else {
    console.error(`FAILED: ${testDesc}`);
    console.log({
      left,
      right
    });
    return false;
  }
};

export const spy = fn => {
  let intel = [];

  const returnFn = (...args) => {
    const result = fn(...args);
    intel.push({
      args,
      result
    });

    return result;
  };

  returnFn.intel = intel;
  return returnFn;
};
