// Super-duper-simple-single memoization
export const m = fn => {
  let lastArgs;
  let memo;

  return (...args) => {
    if (
      !lastArgs
      || lastArgs.length !== args.length
      || lastArgs.some((a, i) => a !== args[i])
    ) {
      lastArgs = args;
      memo = fn(...args);
    }

    return memo;
  }
}

export class ImmutableMap extends Map {
  constructor(...args) {
    super(...args);
    this.constructed = true;
  }

  clear() {
    // What is purpose?
    return new ImmutableMap();
  }

  delete(key) {
    return new ImmutableMap(this.entries().filter(e => e[0] !== key));
  }

  set(key, value) {
    return this.constructed
      ? new ImmutableMap([...this.entries(), [key, value]])
      : super.set(key, value);
  }
}
