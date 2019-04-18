import { h, render } from './preact.mjs';
import { MovingMaze } from './maze.mjs';

export const main = (mountId) => {
  render(h(MovingMaze, {}), document.getElementById(mountId));
}

