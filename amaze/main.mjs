import { h, render } from './preact.mjs';
import { RandGrid } from './maze.mjs';

export const main = (mountId) => {
  render(h(RandGrid, {}), document.getElementById(mountId));
  console.log('rendered', Date.now());
}

