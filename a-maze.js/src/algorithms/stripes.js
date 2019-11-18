import createAlgorithm from './createAlgorithm.js';

const runner = ({
  dimensions,
  cellSize
}) => {
  const [x, y] = dimensions;

  return [...new Array(x * y)].map((_, i) => ({
    bounds: [
      cellSize * (i % x),
      cellSize * Math.floor(i / x),
      cellSize,
      cellSize 
    ],
    before: '#000',
    after: '#FFF'
  }));
}

export default createAlgorithm({
  layerCount: 1,
  name: 'Stripes',
  runner,
});
