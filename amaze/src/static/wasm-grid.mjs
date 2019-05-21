class WasmGrid extends HTMLElement {
  constructor() {
    super();

    this.canvas = document.createElement('canvas');
    this.canvas.width = 300;
    this.canvas.height = 100;

    this.ctx = this.canvas.getContext('2d');
    this.appendChild(this.canvas);
  }

  async connectedCallback() {
    const pkg = await import('./pkg/index.js');
    const wasm = await pkg.default('./pkg/index_bg.wasm');

    this.pkg = pkg;
    this.wasm = wasm;

    this.grid = pkg.Grid.new(300, 100);
    const data = new Uint8ClampedArray(
      wasm.memory.buffer,
      this.grid.image_data(),
      300 * 100 * 4
    );
    this.imageData = new ImageData(data, 300, 100);

    this.render();
  }

  render() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}

customElements.define("wasm-grid", WasmGrid);
