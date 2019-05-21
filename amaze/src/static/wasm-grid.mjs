class WasmGrid extends HTMLElement {
  constructor() {
    super();

    this.canvas = document.createElement('canvas');

    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.appendChild(this.canvas);
  }

  async connectedCallback() {
    const pkg = await import('./pkg/index.js');
    const wasm = await pkg.default('./pkg/index_bg.wasm');

    this.pkg = pkg;
    this.wasm = wasm;

    this.maze = pkg.Maze.new(10, 500, 300);
    this.width = this.maze.width();
    this.height = this.maze.height();
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    const data = new Uint8ClampedArray(
      wasm.memory.buffer,
      this.maze.image_data(),
      this.width * this.height * 4
    );
    this.imageData = new ImageData(data, this.width, this.height);

    this.render();

    setTimeout(() => {
      this.maze.tick();
      this.render();
    }, 1000);
  }

  render() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}

customElements.define("wasm-grid", WasmGrid);
