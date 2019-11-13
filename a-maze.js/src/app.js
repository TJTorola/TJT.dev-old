import { Component, createElement as h, createRef, useContext } from 'react';
import { Button, Card, Navbar, Slider, Tab, Tabs } from '@blueprintjs/core';

import algorithms from './algorithms/index.js';
import { RouteContext } from './context.js';
import { cx, getCurrentRoute, getRoute, ROUTES } from './lib.js';

const Controls = () => (
  h(Navbar, { className: 'Controls' },
    h(Navbar.Group, { className: 'Controls-group' },
      h(Button, { minimal: true, icon: 'fast-backward' }),
      h(Button, { minimal: true, icon: 'play' }),
      h(Button, { minimal: true, icon: 'fast-forward' }),
      h(Navbar.Divider),
      h(Slider, { labelRenderer: false, className: 'Controls-slider' })
    ),
  )
);

const Generator = () => {
  const { params } = useContext(RouteContext);

  const generator = algorithms.generators[params.generator];
  if (!generator) {
    throw new Error(`Un-handled case, '${params.generator}'`);
  }

  return h(generator);
};

const Maze = () => {
  const route = useContext(RouteContext);

  const Algorithm = {
    SOLVER: Solver,
    GENERATOR: Generator
  }[route.key];

  if (!Algorithm) {
    throw new Error(`Un-handled case, '${route.key}'`);
  }

  return h(Card, { className: 'Maze' }, h(Algorithm));
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
          h(SideBar),
          h('content', { className: 'Content' },
            h(Controls),
            h(Maze)
          )
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

class SideBar extends Component {
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
              className: 'SideBar-algorithms',
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
              className: 'SideBar-algorithms',
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
      h('nav', { className: 'SideBar bp3-elevation-2' },
        h('div', { className: 'SideBar-header' },
          h('h2', { className: 'bp3-heading' }, 'A-Maze'),
        ),
        h(Tabs, { className: 'SideBar-tabs', onChange: this.setTab },
          h(Tab, { id: 'generators', title: 'Generators' }),
          h(Tab, { id: 'solvers', title: 'Solvers' }),
        ),
        this.renderAlgorithms()
      )
    );
  }
};

const Solver = () => {
  const { params } = useContext(RouteContext);

  const solver = algorithms.solvers[params.solver];
  if (!solver) {
    throw new Error(`Un-handled case, '${params.solver}'`);
  }

  return h(solver);
};

