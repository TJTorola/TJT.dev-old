import { createElement as h } from 'react';
import { Button } from '@blueprintjs/core';

const App = () => (
  h('main', { className: 'bp3-dark Wrapper' },
    h('nav', { className: 'Navbar' },
      h('div', { className: 'Navbar-header' },
        h('h2', { className: 'bp3-heading' }, 'A-Maze'),
        h(Button, { icon: 'menu-closed', minimal: true })
      )
    ),
  )
);

export default App;
