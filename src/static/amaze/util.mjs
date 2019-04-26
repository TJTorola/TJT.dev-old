// Super-duper-simple-single memoization
export const m = fn => {
  let lastArgs;
  let memo;

  return (...args) => {
    if (
      !lastArgs ||
      lastArgs.length !== args.length ||
      lastArgs.some((a, i) => a !== args[i])
    ) {
      lastArgs = args;
      memo = fn(...args);
    }

    return memo;
  };
};

export const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || "Component";

export const getLocation = () =>
  window.location.hash.length > 0 ? window.location.hash.slice(1) : "";

const filter = test =>
  function*(iter) {
    let n = iter.next();
    while (!n.done) {
      if (test(n.value)) yield n.value;
      n = iter.next();
    }
  };

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
    return new ImmutableMap(filter(e => e[0] !== key)(this.entries()));
  }

  set(key, value) {
    return this.constructed
      ? new ImmutableMap([...this.entries(), [key, value]])
      : super.set(key, value);
  }

  /**
   * Try to overcome a little of the performance pitfalls of immutability by providing
   * this process method, that takes a number of changes and does them all at once.
   *
   * type Changes = {
   *   sets?: Array<[key: string, value: any]>,
   *   deletes?: Array<key: string>
   * }
   */
  process(changes = {}) {
    const sets = changes.sets || [];
    const deletes = changes.deletes || [];

    return new ImmutableMap([
      ...filter(e => !deletes.includes(e[0]))(this.entries()),
      ...sets
    ]);
  }
}

export const interweave = ([head, ...rest], other) =>
  head !== undefined ? [head, ...interweave(other, rest)] : other;

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const randChar = () => CHARS[Math.floor(Math.random() * 52)];

export const randStr = len => [...new Array(len)].map(randChar).join("");
