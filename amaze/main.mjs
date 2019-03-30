import { h, render } from './preact.mjs';
import { Grid, TEST_MAZE } from './grid.mjs';

export const main = (mountId) => {
  render(h(Grid, { maze: TEST_MAZE }), document.getElementById(mountId));
}

