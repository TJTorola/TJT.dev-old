import { App } from "./app.mjs";
import { Component, h, render } from "./preact.mjs";

class Amaze extends HTMLElement {
  connectedCallback() {
    render(h(App), this);
  }

  disconnectedCallback() {
    render(null, this, this.firstChild);
  }
}

customElements.define("a-maze", Amaze);
