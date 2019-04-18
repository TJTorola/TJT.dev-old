import { Grid as CanvasGrid } from './canvas-grid.mjs';
import { Grid as SvgGrid } from './svg-grid.mjs';
import { ImmutableMap } from './util.mjs';
import { h, render } from './preact.mjs';

const numToHex = n => n.toString(16).padStart(2, '0').toUpperCase();
const randNum = m => Math.floor(Math.random() * m);
const randShade = () => numToHex(randNum(256));
const randColor = () => `#${randShade()}${randShade()}${randShade()}`;
const emptyArr = l => [...new Array(l)];

const generateRandomSvgProps = (x, y) => ({
  maze: {
    maxHeight: window.innerHeight - 30,
    maxWidth: window.innerWidth - 30,
    rows: emptyArr(y).map(() => (
      emptyArr(x).map(randColor)
    )),
    walls: {
      vertical: emptyArr(x - 1).map(() => (
        emptyArr(y).map(() => randNum(2))
      )),
      horizontal: emptyArr(y - 1).map(() => (
        emptyArr(x).map(() => randNum(2))
      ))
    }
  }
});

const generateRandomCanvasProps = (x, y) => ({
  step: 0,
  meta: {
    dimensions: [x, y],
    maxHeight: window.innerHeight - 30,
    maxWidth: window.innerWidth - 30,
  },
  steps: [{
    diff: [],
    cells: new ImmutableMap(
      emptyArr(x).reduce((acc, _, xi) => ([
        ...acc,
        ...emptyArr(y).map((_, yi) => (
          [`${(xi * 2) + 1},${(yi * 2) + 1}`, randColor()]
        ))
      ]), [])
    )
  }]
});

export const testRandomGrid = (type, x, y) => {
  const el = document.getElementById('App');

  const generateRandomProps = type === 'CANVAS'
    ? generateRandomCanvasProps
    : generateRandomSvgProps;

  const Grid = type === 'CANVAS'
    ? CanvasGrid
    : SvgGrid;

  let start, stop;
  console.log('GENERATING RANDOM PROPS');
  start = Date.now();

  const props = generateRandomProps(x, y);

  stop = Date.now();
  console.log(`FINISHED GENERATING RANDOM PROPS, TOOK ${stop - start}ms`);
  console.log('RENDERING GRID');
  start = Date.now();

  render(h(Grid, props), el, el.lastChild);

  stop = Date.now();
  console.log(`FINISHED RENDERING GRID, TOOK ${stop - start}ms`);
};
