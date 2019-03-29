import { h, render } from './preact.mjs';

const Cell = ({ xi, yi, size, wRight, wBottom }) => {
  const x = xi * size;
  const y = yi * size;
  // w: wall
  const wThickness = size / 10;
  const wOffset = size - (wThickness / 2);

  return h('g', {}, [
    h('rect', { x, y, width: size, height: size, class: 'fg' }),
    wRight && h('rect', {
      x: x + wOffset,
      y,
      width: wThickness,
      height: size,
      class: 'bg'
    }),
    wBottom && h('rect', {
      x,
      y: y + wOffset,
      width: size,
      height: wThickness,
      class: 'bg'
    })
  ]);
};

export const main = () => {
  const width = 25;

  render((
    h('svg', { viewBox: '0 0 100 100', xmlns: 'http://www.w3.org/2000/svg' }, [
      h(Cell, { xi: 0, yi: 0, size: 25, wRight: true, wBottom: false }),
      h(Cell, { xi: 0, yi: 1, size: 25, wRight: true, wBottom: true }),
      h(Cell, { xi: 1, yi: 0, size: 25, wRight: false, wBottom: false }),
      h(Cell, { xi: 1, yi: 1, size: 25, wRight: true, wBottom: false }),
    ])
  ), document.body);
}

