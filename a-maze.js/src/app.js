import { Component, createElement as h } from 'react';
import { Button, Tab, Tabs } from '@blueprintjs/core';

import { RouteContext } from './context.js';
import { getRoute } from './lib.js';

export const Navbar = () => (
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

export const Root = () => (
  h(RouteProvider, {}, 
    h('main', { className: 'bp3-dark Wrapper' },
      h(Navbar)
    )
  )
);

export class RouteProvider extends Component {
  state = {
    route: getRoute()
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.setRoute);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.setRoute);
  }

  setRoute = () => {
    this.setState({ route: getRoute() });
  }

  render() {
    return h(RouteContext.Provider, { value: this.state.route }, this.props.children);
  }
}
