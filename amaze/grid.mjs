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
    ['#333', '#EEE'],
    ['#EEE', '#333']
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

export const Grid = ({ maze }) => {
  return h(GridWrapper, {
    rowCount: maze.rows.length,
    colCount: (maze.rows[0] || []).length,
    maxHeight: maze.maxHeight,
    maxWidth: maze.maxWidth
  });
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
