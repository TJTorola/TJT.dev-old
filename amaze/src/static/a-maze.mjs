import { App } from "./app.mjs";
import { StyleContext, Css } from "./context.mjs";
import { Fragment, h, render, unmount, useContext, useEffect } from "./react.mjs";

class Amaze extends HTMLElement {
  constructor() {
    super();
    this.css = new Css();
  }

  connectedCallback() {
    const Root = h(StyleContext.Provider, { value: this.css }, h(() => {
      const css = useContext(StyleContext);
      useEffect(() => {
        css.mount();
        () => css.unmount();
      }, []);

      return h(App)
    }));

    render(Root, this);
  }

  disconnectedCallback() {
    unmount(this);
  }
}

customElements.define("a-maze", Amaze);
