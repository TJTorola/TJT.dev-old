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
  }, maze.rows.map((fills, yIdx) => h(Row, { fills, yIdx })));
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
