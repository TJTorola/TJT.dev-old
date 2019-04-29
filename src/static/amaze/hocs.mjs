import {
  getDisplayName,
  getRoute,
  getParams,
  interweave,
  randStr
} from "./util.mjs";
import { Component, h } from "./preact.mjs";

class Css {
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

    return WrappedComponent => {
      const WithClasses = props => h(WrappedComponent, { ...props, classes });

      WithClasses.displayName = `withClasses(${getDisplayName(
        WrappedComponent
      )})`;
      return WithClasses;
    };
  }
}

export const withCss = WrappedComponent => {
  class WithCss extends Component {
    componentWillMount() {
      this._css = new Css();
      this._css.mount();
    }

    componentWillUnmount() {
      this._css.unmount();
    }

    getChildContext() {
      return { css: this._css };
    }

    render(props) {
      return h(WrappedComponent, props);
    }
  }

  WithCss.displayName = `withCss(${getDisplayName(WrappedComponent)})`;
  return WithCss;
};

export const withClasses = style => WrappedComponent => {
  class WithClasses extends Component {
    componentWillMount() {
      this._withClasses = this.context.css.apply(style);
    }

    componentWillUnmount() {
      // TODO
    }

    render(props) {
      return h(this._withClasses(WrappedComponent), props);
    }
  }

  WithClasses.displayName = `withClasses(${getDisplayName(WrappedComponent)})`;
  return WithClasses;
};

export const withRoute = WrappedComponent => {
  class WithRoute extends Component {
    constructor(props) {
      super(props);
      this.update = this.forceUpdate.bind(this);
    }

    componentDidMount() {
      window.addEventListener("hashchange", this.update);
    }

    componentWillUnmount() {
      window.removeEventListener("hashchange", this.update);
    }

    render(props) {
      const { hash } = window.location;
      const route = getRoute(hash);
      const params = getParams(hash);

      return h(WrappedComponent, { ...props, route, params });
    }
  }

  WithRoute.displayName = `withRoute(${getDisplayName(WrappedComponent)})`;
  return WithRoute;
};

export const withHocs = hocs => WrappedComponent =>
  hocs.reduce((acc, hoc) => hoc(acc), WrappedComponent);
