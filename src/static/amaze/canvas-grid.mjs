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

const makeCtx = m(canvas => {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  ctx.scale(dpr, dpr);
  return ctx;
});

export class Grid extends Component {
  componentDidMount() {
    paintFull({
      ctx: this.ctx,
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
        ctx: this.ctx,
        cells: steps[step].cells,
        meta
      });
      return;
    }

    const lower = Math.min(lastProps.step, step);
    const upper = Math.max(lastProps.step, step);
    // Exclude the lower since it's diff is compared to it's prev step
    const diff = new Set();
    for (let i = lower + 1; i <= upper; i++) {
      steps[i].diff.forEach(coord => diff.add(coord));
    }

    paintDiff({
      ctx: this.ctx,
      cells: steps[step].cells,
      meta,
      diff
    });
  }

  get ctx() {
    return makeCtx(this.canvas);
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
      width: this.width * window.devicePixelRatio,
      height: this.height * window.devicePixelRatio,
      style: {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
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

const getExMeta = m(meta => ({
  height: getHeight(meta),
  width: getWidth(meta),
  cellSize: getCellSize(meta),
  wallSize: getCellSize(meta) * WALL_RATIO,
  ...meta
}));

const paintCell = ({ ctx, exMeta }, cell) => {
  const { wallSize, cellSize } = exMeta;
  const [ coord, color ] = cell;
  const [x, y] = coord.split(',').map(c => parseInt(c, 10));

  const width = x % 2 === 0 ? wallSize : cellSize;
  const height = y % 2 === 0 ? wallSize : cellSize;

  const xOffset = Math.floor(x / 2) * (cellSize + wallSize) + (x % 2 === 1 ? wallSize : 0);
  const yOffset = Math.floor(y / 2) * (cellSize + wallSize) + (y % 2 === 1 ? wallSize : 0);

  ctx.fillStyle = color;
  ctx.fillRect(xOffset, yOffset, width, height);
}

const paintFull = ({ ctx, cells, meta }) => {
  const exMeta = getExMeta(meta);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, exMeta.width, exMeta.height);

  for (const cell of cells.entries()) {
    paintCell({ ctx, exMeta }, cell);
  }
};

const paintDiff = ({ ctx, cells, meta, diff }) => {
  const exMeta = getExMeta(meta);

  diff.forEach(coord => {
    paintCell(
      { ctx, exMeta },
      [ coord, cells.get(coord) || '#000' ]
    );
  });
};
