import { getCurrentRoute } from '../lib.js';

export const getDimensions = () => {
  const { params } = getCurrentRoute();

  return params.seed
    ? params.seed.split('x').map(i => parseInt(i, 10))
    : null;
}
