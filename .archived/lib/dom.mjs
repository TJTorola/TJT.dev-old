export const useState = () => { throw new Error("Not yet implimented"); }
export const useEffect = () => { throw new Error("Not yet implimented"); }
export const render = () => { throw new Error("Not yet implimented"); }

export const h = (el, props = {}, children = []) => {
  switch (typeof el) {
    case "function": {
      return el({ ...props, children });
    }
    case "string": {
      return {
        el,
        props,
        children
      };
    }
    default: {
      throw new Error(`H: unknown type of el, ${typeof el}`);
    }
  }
};
