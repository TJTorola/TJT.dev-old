import { Component, h, render } from './preact.mjs';

const getDisplayName = WrappedComponent => (
  WrappedComponent.displayName || WrappedComponent.name || 'Component'
);

const getLocation = () => (
  window.location.hash.length > 0
    ? window.location.hash.slice(1)
    : ''
);

const withRoute = WrappedComponent => {
  class WithRoute extends Component {
    constructor(props) {
      super(props);

      this.state = {
        route: getLocation()
      }

      this.onLocationChange = this.onLocationChange.bind(this);
    }

    componentDidMount() {
      window.addEventListener('hashchange', this.onLocationChange);
    }

    componentWillUnmount() {
      window.removeEventListener('hashchange', this.onLocationChange);
    }

    onLocationChange() {
      this.setState({
        route: getLocation()
      });
    }

    render(props, { route }) {
      return h(WrappedComponent, { ...props, route });
    }
  }

  WithRoute.displayName = `withRoute(${getDisplayName(WrappedComponent)})`;
  return WithRoute;
}

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

const main = () => {
  render(h(Root, {}), document.body);
}

export {
  main
};
