import { h, render } from './preact.mjs';
import { App } from './app.mjs';

export const main = (mountId) => (
  render(h(App, {}), document.getElementById(mountId))
)

