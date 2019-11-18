import { Component, createElement as h } from 'react';
import { Button, Card, Navbar, ResizeSensor, Slider, Tab, Tabs } from '@blueprintjs/core';

import algorithms from './algorithms/index.js';
import { RouteContext } from './context.js';
import { cx, getCurrentRoute, getRoute, ROUTES } from './lib.js';

class Controls extends Component {
  interval = null

  state = {
    playing: false,
  }

  jumpBackward = () => {
    this.stop();
    this.props.setStep(0);
  }

  jumpForward = () => {
    this.stop();
    this.props.setStep(this.props.stepCount);
  }

  play = () => {
    if (this.state.playing || this.props.step >= this.props.stepCount) return;

    this.setState({ playing: true });
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      const { setStep, step, stepCount } = this.props;
      if (step >= stepCount) {
        this.stop();
      } else {
        setStep(step + 1);
      }
    }, 100);
  }

  setSliderValue = value => {
    this.stop();
    this.props.setStep(value);
  }

  stop = () => {
    if (!this.state.playing || this.props.step <= 0) return;

    this.setState({ playing: false });
    clearInterval(this.interval);
    this.interval = null;
  }

  togglePlaying = () => {
    if (this.state.playing) {
      this.stop();
    } else {
      this.play();
    }
  }

  render() {
    const { playing } = this.state;
    const { step, stepCount } = this.props;

    if (!stepCount) {
      return (
        h(Navbar, { className: 'Controls' },
          h(Navbar.Group, { className: 'Controls-group' })
        )
      );
    }

    return (
      h(Navbar, { className: 'Controls' },
        h(Navbar.Group, { className: 'Controls-group' },
          h(Button, {
            disabled: step <= 0,
            icon: 'step-backward',
            minimal: true,
            onClick: this.jumpBackward
          }),
          h(Button, {
            disabled: (
              (!playing && step >= stepCount) ||
              (playing && step <= 0)
            ),
            icon: this.state.playing ? 'pause' : 'play',
            minimal: true,
            onClick: this.togglePlaying
          }),
          h(Button, {
            disabled: step >= stepCount,
            icon: 'step-forward',
            minimal: true,
            onClick: this.jumpForward
          }),
          h(Navbar.Divider),
          h(Slider, {
            className: 'Controls-slider',
            labelRenderer: false,
            max: stepCount,
            onChange: this.setSliderValue,
            value: step
          })
        ),
      )
    );
  }
};

class Maze extends Component {
  static contextType = RouteContext;

  onResize = resizeValues => {
    if (this.context.key === 'INDEX') {
      const { height, width } = resizeValues[0].contentRect;
      const cellHeight = Math.floor(height / this.props.cellSize);
      const cellWidth = Math.floor(width / this.props.cellSize);
      const seed = `${cellWidth}x${cellHeight}`;
      window.location.hash = getRoute(ROUTES.SEED, { seed });
    }
  }

  renderAlgorithm = () => {
    const { key, params } = this.context;
    if (['INDEX', 'SEED'].includes(key)) return null;

    const Algorithm = (() => {
      switch (key) {
        case 'GENERATOR': {
          const generator = algorithms.generators[params.generator];
          if (!generator) {
            throw new Error(`Could not find generator: '${params.generator}'`);
          }

          return generator;
        }
        case 'SOLVER': {
          const solver = algorithms.solvers[params.solver];
          if (!solver) {
            throw new Error(`Could not find solver: '${params.solver}'`);
          }

          return solver;
        }
        default: {
          throw new Error(`Un-handled case, '${key}'`);
        }
      }
    })();

    return h(Algorithm, {
      cellSize: this.props.cellSize,
      step: this.props.step,
      setStepCount: this.props.setStepCount
    });
  }

  render() {
    return (
      h(ResizeSensor, { onResize: this.onResize },
        h(Card, { className: 'Maze' }, this.renderAlgorithm())
      )
    );
  };
}

export class Root extends Component {
  state = {
    cellSize: 10,
    darkMode: true,
    step: 0,
    stepCount: 0
  }

  setStep = step => this.setState({ step })
  setStepCount = stepCount => this.setState({ stepCount })

  render() {
    const { cellSize, darkMode, step, stepCount } = this.state;

    return (
      h(RouteProvider, {}, 
        h('main', { className: cx({ Wrapper: true, 'bp3-dark': darkMode }) },
          h(SideBar),
          h('div', { className: 'Content' },
            h(Controls, {
              setStep: this.setStep,
              step,
              stepCount
            }),
            h(Maze, {
              cellSize,
              step,
              setStepCount: this.setStepCount
            })
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

