import { h } from './preact.mjs';

const CELL_SIZE = 10;

/**
 * type Fill = string
 * type Maze = {
 *   maxHeight: number,
 *   maxWidth: number,
 *   rows: Array<Array<Fill>>,
 *   walls: {
 *     vertical: Array<Array<boolean>>,
 *     horizontal: Array<Array<boolean>>
 *   }
 * }
 */

export const TEST_MAZE = {
  maxHeight: 500,
  maxWidth: 400,
  rows: [
    ['#0000FF', '#FF0000'],
    ['#AAA', '#00FF00']
  ],
  walls: {
    vertical: [
      [true, false]
    ],
    horizontal: [
      [false, true]
    ]
  }
}

const Fill = ({ fill, xIdx, yIdx }) => (
  h('rect', {
    x: xIdx * CELL_SIZE,
    y: yIdx * CELL_SIZE,
    width: CELL_SIZE,
    height: CELL_SIZE,
    style: { fill }
  })
);

const Row = ({ fills, yIdx }) => (
  h('g', {}, fills.map((fill, xIdx) => (
    h(Fill, { fill, xIdx, yIdx })
  )))
);

export const Grid = ({ maze }) => {
  return h(GridWrapper, {
    rowCount: maze.rows.length,
    colCount: (maze.rows[0] || []).length,
    maxHeight: maze.maxHeight,
    maxWidth: maze.maxWidth
  }, [
    ...maze.rows.map((fills, yIdx) => h(Row, { fills, yIdx })),
    ...maze.walls.vertical.map(
      (walls, x) => h(Walls, { xIdx: x + 1, yIdx: 0, walls })
    ),
    ...maze.walls.horizontal.map(
      (walls, y) => h(Walls, { xIdx: 0, yIdx: y + 1, walls })
    )
  ]);
}

const GridWrapper = ({ rowCount, colCount, maxHeight, maxWidth, children }) => {
  const maxCellHeight = maxHeight / rowCount;
  const maxCellWidth = maxWidth / colCount;
  const cellSize = Math.min(maxCellHeight, maxCellWidth);

  return h('svg', {
    height: `${cellSize * rowCount}px`,
    width: `${cellSize * colCount}px`,
    viewBox: `0 0 ${colCount * CELL_SIZE} ${rowCount * CELL_SIZE}`,
    xmlns: 'http://www.w3.org/2000/svg'
  }, children);
}

const Walls = ({ walls, xIdx, yIdx }) => {
  // sx, xy - starting point
  const [ sx, sy ] = [ xIdx * CELL_SIZE, yIdx * CELL_SIZE ];
  // I am infering the direction these walls should go based on the starting points,
  // EX: If we are starting on the x-axis I can assume we are going down, eg: dx === 0
  const [ dx, dy ] = [
    (xIdx === 0) ? CELL_SIZE : 0,
    (yIdx === 0) ? CELL_SIZE : 0
  ];

  const strokes = [...walls, false].reduce((strokes, wall, idx) => {
    const stroke = strokes[strokes.length - 1].end === undefined
      ? strokes.pop()
      : {};

    const nIdx = idx + 1;
    const pt = [sx + (dx * idx), sy + (dy * idx)];

    return [...strokes, (
      wall
        ? stroke.start
          ? stroke
          : { start: pt }
        : stroke.start
          ? { start: stroke.start, end: pt }
          : stroke
    )];
  }, [{}]);

  return h('g', {
    stroke: 'black',
    ['stroke-width']: CELL_SIZE / 10,
    ['stroke-linecap']: 'square'
  }, strokes.map(stroke => {
    if (stroke.start !== undefined && stroke.end !== undefined) {
      const [ x1, y1 ] = stroke.start;
      const [ x2, y2 ] = stroke.end;

      return h('line', { x1, y1, x2, y2 });
    } else {
      return;
    }
  }))
}
