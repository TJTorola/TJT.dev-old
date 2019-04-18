import { Grid } from './canvas-grid.mjs';
import { ImmutableMap } from './util.mjs';
import { h } from './preact.mjs';

const numToHex = n => n.toString(16).padStart(2, '0').toUpperCase();
const randNum = m => Math.floor(Math.random() * m);
const randShade = () => numToHex(randNum(256));
const randColor = () => `#${randShade()}${randShade()}${randShade()}`;
const emptyArr = l => [...new Array(l)];

const generateRandomGrid = (w, h) => {
  const grid = {
    maxHeight: window.screen.height - 30,
    maxWidth: window.screen.width - 30,
    rows: emptArr(h).map(() => (
      emptArr(w).map(randColor)
    )),
    walls: {
      vertical: emptArr(w - 1).map(() => (
        emptArr(h).map(() => randNum(2))
      )),
      horizontal: emptArr(h - 1).map(() => (
        emptArr(w).map(() => randNum(2))
      ))
    }
  };
  return grid;
};

export const randCells = (x, y) => (
  emptyArr(x).reduce((acc, _, xi) => ([
    ...acc,
    ...emptyArr(y).map((_, yi) => (
      [`${(xi * 2) + 1},${(yi * 2) + 1}`, randColor()]
    ))
  ]), [])
);

export const RandGrid = ({ x, y }) => h(Grid, {
  step: 0,
  meta: {
    dimensions: [x, y],
    maxHeight: window.innerHeight - 30,
    maxWidth: window.innerWidth - 30,
  },
  steps: [{
    diff: [],
    cells: new ImmutableMap(randCells(x, y))
  }]
});
