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
    const ranX = twister.nextNum(x);
    const ranY = twister.nextNum(y);
    const cell = [ranX, ranY];

    const ranR = twister.nextNum(256);
    const ranB = twister.nextNum(256);
    const ranG = twister.nextNum(256);
    const color = `rgb(${ranR},${ranB},${ranG})`;

    builder.setCell(cell, color);
  }

  return builder.steps;
}

export default createAlgorithm({
  layerCount: 1,
  name: 'Random',
  runner,
});
