const main = (el: HTMLCanvasElement): void => {
  const context = el.getContext("2d");
  if (!context) {
    throw new Error("Could not get context for provided element");
  }
};
