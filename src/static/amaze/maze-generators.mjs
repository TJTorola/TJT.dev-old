import { getExMeta } from "./canvas-grid.mjs";
import { ImmutableMap } from "./util.mjs";

const numToHex = n =>
  n
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();
const randNum = m => Math.floor(Math.random() * m);
const randShade = () => numToHex(randNum(256));
const randColor = () => `#${randShade()}${randShade()}${randShade()}`;
const emptyArr = l => [...new Array(l)];

const randCoord = (maxX, maxY) =>
  `${randNum(maxX * 2 + 1)},${randNum(maxY * 2 + 1)}`;
const randChange = (maxX, maxY) => [randCoord(maxX, maxY), randColor()];

export const genRandomMaze = (cnt, meta) => {
  const [maxX, maxY] = getExMeta(META).dimensions;
  const makeSteps = (steps = [{ cells: new ImmutableMap(), diff: [] }]) => {
    if (steps.length === cnt) return steps;
    const last = steps[steps.length - 1];

    const sets = emptyArr(4).map(() => randChange(maxX, maxY));
    const deletes = emptyArr(2).map(randCoord);
    const diff = [...deletes, ...sets.map(s => s[0])];
    const cells = last.cells.process({ sets, deletes });

    const step = {
      cells,
      diff
    };

    return recur([...steps, step]);
  };

  const steps = makeSteps();

  return {
    step: 0,
    meta,
    steps: makeSteps()
  };
};
