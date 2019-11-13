import { createElement as h } from 'react';

export default {
  generators: {
    'depth-first': () => h('div', {}, 'Depth First: Not yet implimented'),
    'hilburts': () => h('div', {}, 'Hilburts: Not yet implimented'),
    'kruskals': () => h('div', {}, 'Kruscals: Not yet implimented'),
    'prims': () => h('div', {}, 'Prims: Not yet implimented'),
    'random': () => h('div', {}, 'Random: Not yet implimented'),
    'stripes': () => h('div', {}, 'Stripes: Not yet implimented'),
  },
  solvers: {
    'breadth-first': () => h('div', {}, 'Breadth First: Not yet implimented'),
    'dead-end-filling': () => h('div', {}, 'Dead End Filling: Not yet implimented'),
    'wall-follower': () => h('div', {}, 'Wall Follower: Not yet implimented'),
  }
}
