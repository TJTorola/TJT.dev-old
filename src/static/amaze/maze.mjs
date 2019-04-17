import { Grid } from './canvas-grid.mjs';
import { h } from './preact.mjs';

const numToHex = n => n.toString(16).padStart(2, '0').toUpperCase();
const randNum = m => Math.floor(Math.random() * m);
const randShade = () => numToHex(randNum(256));
const randColor = () => `#${randShade()}${randShade()}${randShade()}`;
const emptArr = l => [...new Array(l)];

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

export const RandGrid = () => h(Grid, {
  dimensions: [6, 4],
  maxHeight: window.screen.height - 30,
  maxWidth: window.screen.width - 30,
  step: 0,
  steps: [{
    diff: [],
    cells: new Map()
  }]
});
