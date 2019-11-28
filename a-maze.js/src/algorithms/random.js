import createAlgorithm from './createAlgorithm.js';
import MersenneTwister from './mersenneTwister.js';

const runner = ({
  dimensions,
  cellSize
}) => {
  const [x, y] = dimensions;
  const length = x * y;
  const twister = new MersenneTwister();
  twister.setSeed(0);

  return [...new Array(length)].map(() => {
    const i = Math.floor(twister.nextFloat() * length);

    return {
      bounds: [
        cellSize * (i % x),
        cellSize * Math.floor(i / x),
        cellSize,
        cellSize 
      ],
      before: '#000',
      after: '#FFF'
    };
  });
}

export default createAlgorithm({
  layerCount: 1,
  name: 'Random',
  runner,
});
