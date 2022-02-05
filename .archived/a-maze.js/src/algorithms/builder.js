export default class Builder {
  constructor({ dimensions, cellSize }) {
    this.dimensions = dimensions;
    this.cellSize = cellSize;

    this.colorState = [...new Array(dimensions[0])].map(() => (
      [...new Array(dimensions[1])].map(() => '#000000')
    ));

    this.steps = [];
  }

  setCell = (cell, color) => {
    const [x, y] = cell;
    const before = this.colorState[x][y];
    this.colorState[x][y] = color;

    const { cellSize } = this;

    this.steps.push({
      bounds: [
        cellSize * x,
        cellSize * y,
        cellSize,
        cellSize
      ],
      before,
      after: color
    });
  }
}
