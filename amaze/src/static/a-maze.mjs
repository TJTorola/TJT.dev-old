import { App } from "./app.mjs";
import { Component, h, render, unmount } from "./react.mjs";

class Amaze extends HTMLElement {
  connectedCallback() {
    render(h(App), this);
  }

  disconnectedCallback() {
    unmount(this);
  }
}

customElements.define("a-maze", Amaze);
