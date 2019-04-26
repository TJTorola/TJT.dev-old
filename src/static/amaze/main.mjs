import { App } from "./app.mjs";
import { withCss } from "./hocs.mjs";
import { Component, h, render } from "./preact.mjs";

class Amaze extends HTMLElement {
  connectedCallback() {
    render(h(withCss(App)), this);
  }

  disconnectedCallback() {
    render(null, this, this.firstChild);
  }
}

customElements.define("a-maze", Amaze);
