import { h, render } from './preact.mjs';
import { RandGrid } from './maze.mjs';

export const main = (mountId) => {
  render(h(RandGrid, { x: 20, y: 14 }), document.getElementById(mountId));
}

