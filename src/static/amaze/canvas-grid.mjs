import { Component, h } from './preact.mjs';
import { m } from './util.mjs';

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
    meta: {
      dimensions: [number, number],
      maxHeight: number,
      maxWidth: number,
    },
    step: number,
    steps: Array<Step>
  }
**/

export class Grid extends Component {
  componentDidMount() {
    paintFull({
      canvas: this.canvas,
      cells: this.props.steps[this.props.step].cells,
      meta: this.props.meta
    });
  }

  componentDidUpdate(lastProps) {
    const { step, meta, steps } = this.props;

    if (lastProps.step === step) return;
    if (lastProps.meta !== meta) {
      console.warn('META_CHANGED: Forcing expensive full re-render');
      paintFull({
        canvas: this.canvas,
        cells: steps[step].cells,
        meta
      });
      return;
    }

    const lower = Math.min(lastStep, step);
    const upper = Math.max(lastStep, step);
    // Exclude the lower since it's diff is compared to it's prev step
    const diff = new Set();
    for (let i = lower + 1; i <= upper; i++) {
      steps[i].diff.forEach(coord => diff.add(coord));
    }

    paintDiff({
      canvas: this.canvas,
      cells: steps[step].cells,
      meta,
      diff
    });
  }

  get width() {
    return getWidth(this.props.meta);
  }

  get height() {
    return getHeight(this.props.meta);
  }

  render() {
    return h('canvas', {
      ref: r => this.canvas = r,
      width: this.width,
      height: this.height
    });
  }
}

const getCellSize = m(({ dimensions, maxHeight, maxWidth }) => {
  const [x, y] = dimensions;

  const xWallCnt = x + 1;
  const xCellUnits = x + (xWallCnt * WALL_RATIO);
  const maxCellWidth = maxWidth / xCellUnits;

  const yWallCnt = y + 1;
  const yCellUnits = y + (yWallCnt * WALL_RATIO);
  const maxCellHeight = maxHeight / yCellUnits;

  return Math.min(maxCellWidth, maxCellHeight);
});

const getWidth = m(meta => {
  const cellSize = getCellSize(meta);
  const x = meta.dimensions[0];

  const xWallCnt = x + 1;
  const xCellUnits = x + (xWallCnt * WALL_RATIO);
  
  return xCellUnits * cellSize;
});

const getHeight = m(meta => {
  const cellSize = getCellSize(meta);
  const y = meta.dimensions[1];

  const yWallCnt = y + 1;
  const yCellUnits = y + (yWallCnt * WALL_RATIO);
  
  return yCellUnits * cellSize;
});

const paintFull = ({ canvas, cells, meta }) => {
  const ctx = canvas.getContext('2d');
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const cellSize = getCellSize(meta);
  const wallSize = cellSize * WALL_RATIO;

  for (const [ coord, color ] of cells.entries()) {
    const [x, y] = coord.split(',').map(c => parseInt(c, 10));

    const width = x % 2 === 0 ? wallSize : cellSize;
    const height = y % 2 === 0 ? wallSize : cellSize;

    const xOffset = Math.floor(x / 2) * (cellSize + wallSize) + (x % 2 === 1 ? wallSize : 0);
    const yOffset = Math.floor(y / 2) * (cellSize + wallSize) + (y % 2 === 1 ? wallSize : 0);

    ctx.fillStyle = color;
    ctx.fillRect(xOffset, yOffset, width, height);
  }
};

const paintDiff = ({ ctx, canvas, cells, diff }) => {
};
