class WasmGrid extends HTMLElement {
  constructor() {
    super();

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.appendChild(this.canvas);
  }

  async connectedCallback() {
    const pkg = await import('./pkg/index.js');
    const wasm = await pkg.default('./pkg/index_bg.wasm');

    this.pkg = pkg;
    this.wasm = wasm;
  }
}

customElements.define("wasm-grid", WasmGrid);
