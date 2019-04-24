import { App } from './app.mjs';
import { withCss } from './hocs.mjs';
import { Component, h, render } from './preact.mjs';

export const main = id => {
  const app = render(h(withCss(App)), document.getElementById(id));
  return () => render(null, document.getElementById(id), app);
};

