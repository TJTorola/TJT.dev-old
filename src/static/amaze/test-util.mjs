// Who tests the test functions?
export const makeSuite = tests => () => (
  tests.reduce((acc, test) => (
    // NOTE: this short-circuits later tests, maybe good?
    acc && test()
  ), true)
);

export const assertEquals = (
  testDesc,
  leftFn,
  right
) => () => {
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

export const assertIs = (
  testDesc,
  leftFn,
  right
) => () => {
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
  let callCount = 0;
  let returns = [];

  const returnFn = (...args) => {
    const result = fn(...args);

    callCount += 1;
    returns.push(result);

    return result;
  }
  
  returnFn.callCount = callCount;
  returnFn.returns = returns;
  return returnFn;
}
