import createAlgorithm from './createAlgorithm.js';
import MersenneTwister from './mersenneTwister.js';
import Builder from './builder.js';

const runner = ({
  dimensions,
  cellSize
}) => {
  const [x, y] = dimensions;
  const length = x * y;
  const builder = new Builder({ dimensions, cellSize });
  const twister = new MersenneTwister();
  twister.setSeed(0);

  for (let i = 0; i < length; i++) {
    const ranX = Math.floor(twister.nextFloat() * x); 
    const ranY = Math.floor(twister.nextFloat() * y); 

    builder.setCell([ranX, ranY], '#FFF');
  }

  return builder.steps;
}

export default createAlgorithm({
  layerCount: 1,
  name: 'Random',
  runner,
});
