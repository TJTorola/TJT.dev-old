import { App } from "./app.mjs";
import { StyleContext, Css } from "./context.mjs";
import { Fragment, h, render, unmount } from "./react.mjs";

class Amaze extends HTMLElement {
  constructor() {
    super();
    this.css = new Css();
  }

  connectedCallback() {
    this.css.mount();
    render(h(StyleContext.Provider, { value: this.css }, h(App)), this);
  }

  disconnectedCallback() {
    this.css.unmount();
    unmount(this);
  }
}

customElements.define("a-maze", Amaze);
