import { Component, h } from './preact.mjs';

// How thick is a wall compared to a cell
const WALL_RATIO = .1;

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
    dimensions: [number, number],
    maxHeight: number,
    maxWidth: number,
    step: number,
    steps: Array<Step>
  }
**/

export class Grid extends Component {
  componentDidMount() {
    paintFull({
      canvas: this.canvas,
      ctx: this.canvas.getContext('2d'),
      cells: this.props.steps[this.props.step].cells,
    });
  }

  componentDidUpdate(lastProps) {
    const lastStep = lastProps.step;
    if (lastStep === this.props.step) return;

    const lower = Math.min(lastStep, this.props.step);
    const upper = Math.max(lastStep, this.props.step);
    // Exclude the lower since it's diff is compared to it's prev step
    const diff = new Set();
    for (let i = lower + 1; i <= upper; i++) {
      this.props.steps[i].diff.forEach(coord => diff.add(coord));
    }

    paintDiff({
      canvas: this.canvas,
      ctx: this.canvas.getContext('2d'),
      cells: this.props.steps[this.props.step].cells,
      diff
    });
  }

  get cellSize() {
    const { dimensions, maxHeight, maxWidth } = this.props;
    const [x, y] = dimensions;

    const maxCellWidth = maxWidth / (x + (WALL_RATIO * (x - 1)));
    const maxCellHeight = maxHeight / (y + (WALL_RATIO * (y - 1)));

    return Math.min(maxCellWidth, maxCellHeight);
  }

  get width() {
    return this.cellSize * this.props.dimensions[0];
  }

  get height() {
    return this.cellSize * this.props.dimensions[1];
  }

  render() {
    return h('canvas', {
      ref: r => this.canvas = r,
      width: this.width,
      height: this.height
    });
  }
}

const paintFull = ({ ctx, canvas, cells }) => {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const paintDiff = ({ ctx, canvas, cells, diff }) => {
};
