import { getDisplayName, getLocation } from './lib.mjs';
import { Component, h } from './preact.mjs';

export const withLoader = (loader, WrappedComponent) => {
  class WithLoader extends Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true
      }
    }

    componentDidMount() {
      loader().finally(() => {
        this.setState({
          loading: false
        })
      })
    }

    render(props) {
      if (loading) {
        return h('div', {}, 'Loading...');
      } else {
        return h(WrappedComponent, props);
      }
    }
  }

  WithLoader.displayName = `withLoader(${getDisplayName(WrappedComponent)})`;
  return withLoader;
}

export const withRoute = WrappedComponent => {
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
