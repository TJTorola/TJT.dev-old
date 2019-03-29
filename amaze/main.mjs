import { h, render } from './preact.mjs';

const Cell = ({ xi, yi, size, wLeft, wTop }) => {
  const x = xi * size;
  const y = yi * size;
  // w: wall
  const wThickness = size / 10;

  return h('g', {}, [
    h('rect', { x, y, width: size + .1, height: size + .1, class: 'bg' }),
    wLeft && h('rect', {
      x,
      y,
      width: wThickness,
      height: size + .1,
      class: 'wall'
    }),
    wTop && h('rect', {
      x,
      y,
      width: size + .1,
      height: wThickness,
      class: 'wall'
    })
  ]);
};

export const main = () => {
  const width = 25;

  render((
    h('svg', {
      width: '1000px',
      height: '1000px',
      viewBox: '0 0 100 100',
      xmlns: 'http://www.w3.org/2000/svg'
    }, [
      h(Cell, { xi: 0, yi: 0, size: 25, wLeft: true, wTop: false }),
      h(Cell, { xi: 1, yi: 0, size: 25, wLeft: true, wTop: true }),
      h(Cell, { xi: 0, yi: 1, size: 25, wLeft: false, wTop: false }),
      h(Cell, { xi: 1, yi: 1, size: 25, wLeft: true, wTop: false }),
    ])
  ), document.body);
}

