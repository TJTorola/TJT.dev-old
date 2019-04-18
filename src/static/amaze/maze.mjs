import { Grid } from './canvas-grid.mjs';
import { ImmutableMap } from './util.mjs';
import { Component, h } from './preact.mjs';

const numToHex = n => n.toString(16).padStart(2, '0').toUpperCase();
const randNum = m => Math.floor(Math.random() * m);
const randShade = () => numToHex(randNum(256));
const randColor = () => `#${randShade()}${randShade()}${randShade()}`;
const emptyArr = l => [...new Array(l)];

const X = 30;
const Y = 10;

const randCoord = () => `${randNum(X) * 2 + 1},${randNum(Y) * 2 + 1}`;
const randChange = () => [ randCoord(), randColor() ];

const genRandomSteps = cnt => {
  const recur = (steps = [{ cells: new ImmutableMap(), diff: [] }]) => {
    if (steps.length === cnt) return steps;
    const last = steps[steps.length - 1];

    const sets = emptyArr(2).map(randChange);
    const deletes = [randCoord()];
    const diff = [...deletes, ...sets.map(s => s[0])];
    const cells = last.cells.process({ sets, deletes });

    const step = {
      cells,
      diff
    };

    return recur([...steps, step]);
  };

  return recur();
}

export class MovingMaze extends Component {
  constructor(props) {
    super(props);

    this.i = 0;
    this.state = {
      step: 0,
      meta: {
        dimensions: [X, Y],
        maxHeight: window.innerHeight - 30,
        maxWidth: window.innerWidth - 30,
      },
      steps: genRandomSteps(1000)
    }
  }

  componentDidMount() {
    setInterval(() => {
      const { step, steps } = this.state;
      const nextStep = (step + 1) % steps.length;
      this.setState({ step: nextStep });
    }, 10);
  }

  render() {
    return h(Grid, this.state);
  }
}

