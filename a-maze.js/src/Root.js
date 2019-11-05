import { createElement as h } from 'react';

const App = () => (
  h('main', { className: 'bp3-dark' },
    h('nav', {},
      h('h2', { className: 'bp3-heading' }, 'A-Maze'),
    ),
  )
);

export default App;
