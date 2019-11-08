import { Component, createElement as h } from 'react';
import { Tab, Tabs } from '@blueprintjs/core';

import { RouteContext } from './context.js';
import { generateRoute, getRoute, ROUTES } from './lib.js';

const onGeneratorChange = generator => {
  window.location.hash = generateRoute(ROUTES.GENERATOR, { generator });
};

export class Navbar extends Component {
  state = {
    tab: 'generators'
  }

  onGeneratorChange = generator => {
    window.location.hash = generateRoute(ROUTES.GENERATOR, { generator });
  }

  onSolverChange = solver => {
    window.location.hash = generateRoute(ROUTES.SOLVER, { solver });
  }

  setTab = tab => {
    this.setState({ tab });
  }

  renderAlgorithms() {
    switch (this.state.tab) {
      case 'generators': {
        return (
          h(Tabs, {
            className: 'Navbar-algorithms',
            vertical: true,
            onChange: this.onGeneratorChange
          },
            h(Tab, { id: 'depth-first', title: 'Depth-first Search' }),
            h(Tab, { id: 'kruskals', title: "Kruskal's Algorithm" }),
            h(Tab, { id: 'prims', title: "Prim's Algorithm" }),
          )
        );
      }

      case 'solvers': {
        return (
          h(Tabs, {
            className: 'Navbar-algorithms',
            vertical: true,
            onChange: this.onSolverChange
          },
            h(Tab, { id: 'breadth-first', title: 'Breadth-first Search' }),
            h(Tab, { id: 'wall-follower', title: 'Wall Follower' }),
            h(Tab, { id: 'dead-end-filling', title: 'Dead-end Filling' }),
          )
        );
      }

      default: {
        throw new Error(`Un-handled case '${this.state.tab}'`);
      }
    }
  }

  render() {
    return (
      h('nav', { className: 'Navbar' },
        h('div', { className: 'Navbar-header' },
          h('h2', { className: 'bp3-heading' }, 'A-Maze'),
        ),
        h(Tabs, { className: 'Navbar-tabs', onChange: this.setTab },
          h(Tab, { id: 'generators', title: 'Generators' }),
          h(Tab, { id: 'solvers', title: 'Solvers' }),
        ),
        this.renderAlgorithms()
      )
    );
  }
};

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
