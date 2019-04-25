import { SCHEME as SC } from './constants.mjs';
import { withClasses, withCss } from './hocs.mjs';
import { Component, h } from './preact.mjs';

const STYLE = `
  .header {
    align-items: center;
    border-bottom: solid ${SC.COLORS.GRAY.M} 1px;
    display: flex;
    flex-direction: row;
    grid-area: 1 / 2;
    justify-content: space-between;
    padding: 0 ${SC.SPACING.M};
  }

  .main {
    display: grid;
    font-family: Helvetica, Arial, sans-serif;
    grid-template-columns: ${SC.SPACING.NAV_WIDTH} auto;
    grid-template-rows: ${SC.SPACING.CONTROL_HEIGHT} auto;
    height: 100%;
    min-height: ${SC.SPACING.MIN_APP_HEIGHT};
    min-width: ${SC.SPACING.MIN_APP_WIDTH};
    width: 100%;
  }

  .nav {
    border-right: solid ${SC.COLORS.GRAY.M} 1px;
    grid-area: 2 / 1;
    padding-left: ${SC.SPACING.M};
    padding-top: ${SC.SPACING.M};
  }

  .section {
    grid-area: 2 / 2;
  }

  .slider {
    flex-grow: 1
  }

  .title {
    align-items: center;
    border-bottom: solid ${SC.COLORS.GRAY.M} 1px;
    border-right: solid ${SC.COLORS.GRAY.M} 1px;
    display: flex;
    grid-area: 1 / 1;
    justify-content: center;
    margin: 0;
  }
`;

export const App = withClasses(STYLE, ({ classes }) => (
  h('main', { class: classes.main }, [
    h('div', { class: classes.title }, [
      h('h1', {}, 'A maze'),
    ]),
    h('header', { class: classes.header }, [
      h('input', {
        class: classes.slider,
        type: 'range',
        min: 1,
        max: 100,
        value: 50,
      }),
    ]),
    h('nav', { class: classes.nav }, [
      h('h2', {}, 'Generators'),
      h('h2', {}, 'Solvers'),
    ]),
    h('section', { class: classes.section }),
  ])
));
