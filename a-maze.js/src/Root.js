import { createElement as h } from 'react';
import { Button, Tab, Tabs } from '@blueprintjs/core';

const App = () => (
  h('main', { className: 'bp3-dark Wrapper' },
    h(Navbar)
  )
);

const Navbar = () => (
  h('nav', { className: 'Navbar' },
    h('div', { className: 'Navbar-header' },
      h('h2', { className: 'bp3-heading' }, 'A-Maze'),
      h(Button, { icon: 'menu-closed', minimal: true })
    ),
    h(Tabs, { className: 'Navbar-tabs' },
      h(Tab, { id: 'generators', title: 'Generators' }),
      h(Tab, { id: 'solvers', title: 'Solvers' }),
    ),
    h(Tabs, { className: 'Navbar-algorithms', vertical: true },
      h(Tab, { id: 'hilburts', title: "Hulburt's Curve" }),
      h(Tab, { id: 'random', title: 'Random' }),
      h(Tab, { id: 'stripes', title: 'Stripe Fill' }),
    )
  )
);

export default App;
