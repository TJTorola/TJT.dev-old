import { Loader } from "./loader.mjs";
import { h, Component } from './react.mjs';

export class Maze extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    }
  }

  render() {
    const { loaded } = this.state;

    if (!loaded) return h(Loader);
  }
}
