import { Component, createElement as h } from 'react';
import { Tab, Tabs } from '@blueprintjs/core';

import { RouteContext } from './context.js';
import { cx, getCurrentRoute, getRoute, ROUTES } from './lib.js';

class Navbar extends Component {
  state = {
    tab: 'generators'
  }

  onGeneratorChange = generator => {
    window.location.hash = getRoute(ROUTES.GENERATOR, { generator });
  }

  onSolverChange = solver => {
    window.location.hash = getRoute(ROUTES.SOLVER, { solver });
  }

  setTab = tab => {
    this.setState({ tab });
  }

  renderAlgorithms() {
    switch (this.state.tab) {
      case 'generators': {
        return (
          h(RouteContext.Consumer, {}, ({ params }) => (
            h(Tabs, {
              className: 'Navbar-algorithms',
              onChange: this.onGeneratorChange,
              selectedTabId: params.generator,
              vertical: true,
            },
              h(Tab, { id: 'depth-first', title: 'Depth-first Search' }),
              h(Tab, { id: 'kruskals', title: "Kruskal's Algorithm" }),
              h(Tab, { id: 'prims', title: "Prim's Algorithm" }),
            )
          ))
        );
      }

      case 'solvers': {
        return (
          h(RouteContext.Consumer, {}, ({ params }) => (
            h(Tabs, {
              className: 'Navbar-algorithms',
              onChange: this.onSolverChange,
              selectedTabId: params.solver,
              vertical: true,
            },
              h(Tab, { id: 'breadth-first', title: 'Breadth-first Search' }),
              h(Tab, { id: 'wall-follower', title: 'Wall Follower' }),
              h(Tab, { id: 'dead-end-filling', title: 'Dead-end Filling' }),
            )
          ))
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

export class Root extends Component {
  state = {
    darkMode: true,
  }

  render() {
    const { darkMode } = this.state;

    return (
      h(RouteProvider, {}, 
        h('main', { className: cx({ Wrapper: true, 'bp3-dark': darkMode }) },
          h(Navbar)
        )
      )
    );
  }
}

class RouteProvider extends Component {
  state = {
    route: getCurrentRoute()
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.setRoute);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.setRoute);
  }

  setRoute = () => {
    this.setState({ route: getCurrentRoute() });
  }

  render() {
    return h(RouteContext.Provider, { value: this.state.route }, this.props.children);
  }
}
