import { Component, h } from './preact.mjs';

/**
 * type Fill = string
 * type Maze = {
 *   maxHeight: number,
 *   maxWidth: number,
 *   rows: Array<Array<Fill>>,
 *   walls: {
 *     vertical: Array<Array<boolean>>,
 *     horizontal: Array<Array<boolean>>
 *   }
 * }
 */

export class Grid extends Component {
  componentDidMount() {
    renderCanvas({
      canvas: this.canvas,
      ctx: this.canvas.getContext('2d'),
      maze: this.props.maze
    });
  }

  componentDidUpdate() {
    renderCanvas({
      canvas: this.canvas,
      ctx: this.canvas.getContext('2d'),
      maze: this.props.maze
    });
  }

  render() {
    return h('canvas', { ref: r => this.canvas = r });
  }
}

const renderCanvas = ({ ctx, canvas, maze }) => {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
