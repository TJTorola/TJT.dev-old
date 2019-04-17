// Super-duper-simple-single memoization
export const m = fn => {
  let called = false;
  let lastArgs;
  let memo;

  return (...args) => {
    if (!called || lastArgs.some((a, i) => a !== args[i])) {
      lastArgs = args;
      memo = fn(...args);
    }

    return memo;
  }
}
