import { createElement as h } from 'react';
import { Button, Tab, Tabs } from '@blueprintjs/core';

const App = () => (
  h('main', { className: 'bp3-dark Wrapper' },
    h('nav', { className: 'Navbar' },
      h('div', { className: 'Navbar-header' },
        h('h2', { className: 'bp3-heading' }, 'A-Maze'),
        h(Button, { icon: 'menu-closed', minimal: true })
      ),
      h(Tabs, { className: 'Navbar-tabs' },
        h(Tab, { id: 'generators', title: 'Generators' }),
        h(Tab, { id: 'solvers', title: 'Solvers' }),
      )
    ),
  )
);

export default App;
