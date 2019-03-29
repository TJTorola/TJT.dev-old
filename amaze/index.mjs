import { withRoute } from './hocs.mjs';
import { h, render } from './preact.mjs';

const Root = withRoute(({ route }) => {
  switch (route) {
    case "":
      return h('div', {}, [
        h('div', {}, 'Test Link'),
        h('a', { href: '#foo' }, 'Foo')
      ]);
    case "foo":
      return h('div', {}, [
        h('a', { href: '#' }, 'Home')
      ]);
    default:
      throw new Error('ROUTE_NOT_FOUND');
  }
});

export const main = () => {
  render(h(Root, {}), document.body);
}

