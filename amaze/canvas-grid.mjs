import { Component, h } from './preact.mjs';

/**
  type Coord = string
  - ex: "1,2" | "231,76"

  type Step = {
    diff: Array<Coord>,
    cells: Map<Coord, Cell>
  }
  - Here diff is the coords that were changed,
  - deleted, or added from the previous step.

  type GridProps = {
    maxHeight: number,
    maxWidth: number,
    currentStep: number,
    steps: Array<{
      diff: Array<Coord>,
      cells: Map<Coord, Cell>
    }
  }
**/

export class Grid extends Component {
  constructor(props) {
    super(props);
    this.renderCanvas = makeRenderCanvas();
  }

  componentDidMount() {
    this.renderCanvas({
      canvas: this.canvas,
      ctx: this.canvas.getContext('2d'),
      cells: this.props.cells
    });
  }

  componentDidUpdate() {
    this.renderCanvas({
      canvas: this.canvas,
      ctx: this.canvas.getContext('2d'),
      cells: this.props.cells
    });
  }

  render() {
    return h('canvas', { ref: r => this.canvas = r });
  }
}

const makeRenderCanvas = () => {
  let lastCells;
  return ({ ctx, canvas, cells }) => {
    if (lastCells === cells) return;

    ctx.fillRect(0, 0, canvas.width, canvas.height);

    lastCells = cells;
  };
}
