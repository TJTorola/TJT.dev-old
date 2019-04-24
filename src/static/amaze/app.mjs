import { withClasses, withCss } from './hocs.mjs';
import { Component, h } from './preact.mjs';

const STYLE = `
  .main {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 300px auto;
    grid-template-rows: 75px auto;
  }

  .header {
    grid-area: 1 / 2;
  }

  .header:hover {
    background: #00FF00;
  }

  .nav {
    grid-area: 1 / 1 / 3 / 1;
  }

  .section {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000;
    grid-area: 2 / 2;
  }
`;

export const App = withClasses(STYLE, ({ classes }) => (
  h('main', { class: classes.main }, [
    h('header', { class: classes.header }),
    h('nav', { class: classes.nav }),
    h('section', { class: classes.section })
  ])
));
