import { Component, h } from "./preact.mjs";
import { m } from "./util.mjs";

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
      cellSize: number,
      wallSize: number,
      maxHeight: number,
      maxWidth: number,
    },
    step: number,
    steps: Array<Step>
  }
**/

const makeCtx = m(canvas => {
  const ctx = canvas.getContext("2d");
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
    if (lastProps.steps !== steps) {
      paintFull({
        ctx: this.ctx,
        cells: steps[step].cells,
        meta
      });
      return;
    }

    const lower = Math.min(lastProps.step, step);
    const upper = Math.max(lastProps.step, step);
    const diff = new Set();
    for (let i = lower; i <= upper; i++) {
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
    return h("canvas", {
      ref: r => (this.canvas = r),
      width: this.width * window.devicePixelRatio,
      height: this.height * window.devicePixelRatio,
      style: {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    });
  }
}

const getDimensions = m(meta => {
  const { cellSize, wallSize, maxWidth, maxHeight } = meta;
  const x = Math.floor((maxWidth - wallSize) / (cellSize + wallSize));
  const y = Math.floor((maxHeight - wallSize) / (cellSize + wallSize));

  return [x, y];
});

const getWidth = m(meta => {
  const { cellSize, wallSize } = meta;
  const [x, _] = getDimensions(meta);
  return wallSize + x * (wallSize + cellSize) + 1;
});

const getHeight = m(meta => {
  const { cellSize, wallSize } = meta;
  const [_, y] = getDimensions(meta);
  return wallSize + y * (wallSize + cellSize) + 1;
});

export const getExMeta = m(meta => ({
  height: getHeight(meta),
  width: getWidth(meta),
  dimensions: getDimensions(meta),
  ...meta
}));

const paintCell = ({ ctx, exMeta }, cell) => {
  const { wallSize, cellSize } = exMeta;
  const [coord, color] = cell;
  const [x, y] = coord.split(",").map(c => parseInt(c, 10));

  if (color) {
    const width = x % 2 === 0 ? wallSize : cellSize;
    const height = y % 2 === 0 ? wallSize : cellSize;

    const xOffset =
      Math.floor(x / 2) * (cellSize + wallSize) + (x % 2 === 1 ? wallSize : 0);
    const yOffset =
      Math.floor(y / 2) * (cellSize + wallSize) + (y % 2 === 1 ? wallSize : 0);

    ctx.fillStyle = color;
    ctx.fillRect(xOffset, yOffset, width, height);
  } else {
    // If !color then this is a delete, we need to delete a little extra to overwrite some AA
    const width = (x % 2 === 0 ? wallSize : cellSize) + wallSize;
    const height = (y % 2 === 0 ? wallSize : cellSize) + wallSize;

    const xOffset =
      Math.floor(x / 2) * (cellSize + wallSize) +
      (x % 2 === 1 ? wallSize : 0) -
      wallSize / 2;
    const yOffset =
      Math.floor(y / 2) * (cellSize + wallSize) +
      (y % 2 === 1 ? wallSize : 0) -
      wallSize / 2;

    ctx.fillStyle = "#000";
    ctx.fillRect(xOffset, yOffset, width, height);
  }
};

const paintFull = ({ ctx, cells, meta }) => {
  const exMeta = getExMeta(meta);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, exMeta.width, exMeta.height);

  for (const cell of cells.entries()) {
    paintCell({ ctx, exMeta }, cell);
  }
};

const paintDiff = ({ ctx, cells, meta, diff }) => {
  const exMeta = getExMeta(meta);

  diff.forEach(coord => {
    const color = cells.get(coord);

    paintCell({ ctx, exMeta }, [coord, color]);
    if (!color) {
      const [x, y] = coord.split(",").map(c => parseInt(c, 10));
      // If this is a delete, we need to repaint the surrounding cells
      const d = [-1, 0, 1];
      const dcoords = d
        .reduce((acc, dx) => [...acc, ...d.map(dy => [dx + x, dy + y])], [])
        .map(([nx, ny]) => `${nx},${ny}`);

      dcoords.forEach(c => {
        if (cells.get(c)) {
          paintCell({ ctx, exMeta }, [c, cells.get(c)]);
        }
      });
    }
  });
};
