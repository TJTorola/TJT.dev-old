import createAlgorithm from './createAlgorithm.js';

const runner = () => [...new Array(5)].map((_, i) => ({
  bounds: [10 * i, 0, 10, 10],
  before: '#000',
  after: '#FFF'
}));

export default createAlgorithm({
  layerCount: 1,
  name: 'Stripes',
  runner,
});
