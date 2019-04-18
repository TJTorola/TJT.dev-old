import { Grid } from './canvas-grid.mjs';
import { ImmutableMap } from './util.mjs';
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
  step: 0,
  meta: {
    dimensions: [3, 2],
    maxHeight: window.innerHeight - 30,
    maxWidth: window.innerWidth - 30,
  },
  steps: [{
    diff: [],
    cells: new ImmutableMap([
      ['1,1', '#AABBCC'],
      ['1,3', '#AABBCC'],
      ['3,1', '#AABBCC'],
      ['3,3', '#AABBCC'],
      ['5,1', '#AABBCC'],
      ['5,3', '#AABBCC'],
    ])
  }]
});
