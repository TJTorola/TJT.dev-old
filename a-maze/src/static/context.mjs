import { interweave, randStr } from "./lib/util.mjs";
import { createContext } from "./react.mjs";

// TODO(Someday): Bring this into the individual app's web-component context
// And then stick it under a shadow dom.
export class Css {
  constructor() {
    this._styleEl = document.createElement("style");
    this._styleEl.type = "text/css";
    this._styleEl.innerHTML = "";

    this._mounted = false;
  }

  mount() {
    if (this._mounted) return;

    document.getElementsByTagName("head")[0].appendChild(this._styleEl);
    this._mounted = true;
  }

  unmount() {
    if (!this._mounted) return;

    this._styleEl.remove();
    this._mounted = false;
  }

  template(strings, ...exps) {
    if (exps.some(exp => typeof exp !== "string")) {
      throw new Error("CSS_TEMPLATE_ERR: All expressions must be strings");
    }

    const unscopedCss = interweave(strings, exps).join("");
    return this.apply(unscopedCss);
  }

  apply(unscopedCss) {
    const unscopedClasses = Array.from(unscopedCss.match(/~[\w-]+/g)).map(r =>
      r.slice(1)
    );

    const classes = unscopedClasses.reduce(
      (acc, clas) => ({
        ...acc,
        [clas]: `${clas}_${randStr(6)}`
      }),
      {}
    );

    const css = Object.keys(classes).reduce(
      (acc, clas) =>
        acc.replace(new RegExp(`~${clas}`, "g"), `.${classes[clas]}`),
      unscopedCss
    );

    this._styleEl.innerHTML += css;

    return { classes, css };
  }

  revoke(css) {
    const filteredStyles = this._styleEl.innerHTML.replace(css, "");
    this._styleEl.innerHTML = filteredStyles;
  }
}

export const StyleContext = createContext();
