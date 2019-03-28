import { getDisplayName, getLocation } from './lib.mjs';
import { Component, h } from './preact.mjs';

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
