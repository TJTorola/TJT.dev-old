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
    step: number,
    steps: Array<Step>
  }
**/

export class Grid extends Component {
  constructor(props) {
    super(props);
    this.renderCanvas = makeRenderCanvas();
  }

  componentDidMount() {
    paintFull({
      canvas: this.canvas,
      ctx: this.canvas.getContext('2d'),
      cells: this.props.steps[this.props.step].cells,
    });
  }

  componentDidUpdate(lastProps) {
    this.paint(lastProps.step);
  }

  paint(lastStep) {
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

  render() {
    return h('canvas', { ref: r => this.canvas = r });
  }
}

const paintFull = ({ ctx, canvas, cells }) => {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const paintDiff = ({ ctx, canvas, cells, diff }) => {
};
