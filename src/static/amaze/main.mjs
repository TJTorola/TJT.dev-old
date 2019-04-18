import { h, render } from './preact.mjs';
import { RandGrid } from './maze.mjs';

export const main = (mountId) => {
  render(h(RandGrid, { x: 200, y: 140 }), document.getElementById(mountId));
}

