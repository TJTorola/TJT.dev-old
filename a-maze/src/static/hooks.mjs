import { StyleContext } from "./context.mjs";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "./react.mjs";

const getRoute = hash => (hash.length > 0 ? hash.slice(1) : "");

const ROUTE_LABELS = ["generator", "solver", "solverSeed"];

const getParams = hash => {
  const route = getRoute(hash);
  const parts = route.split("/");

  return ROUTE_LABELS.reduce(
    (acc, label, idx) => ({ ...acc, [label]: parts[idx] }),
    {}
  );
};

export const getLocation = () => ({
  route: getRoute(window.location.hash),
  params: getParams(window.location.hash)
});

export const getHashRoute = params => {
  const recur = (parts = []) => {
    const label = params[ROUTE_LABELS[parts.length]];
    if (!label) return parts.join("/");
    return recur([...parts, label]);
  };

  return `#${recur()}`;
};

export const useLocation = () => {
  const [location, setLocation] = useState(getLocation());

  useEffect(() => {
    const _setLocation = () => setLocation(getLocation());
    window.addEventListener("hashchange", _setLocation);

    return () => window.removeEventListener("hashchange", _setLocation);
  }, []);

  return location;
};

const thunk = store => next => action => {
  if (typeof action === "function") {
    return action(store);
  } else {
    return next(action);
  }
};

const logger = ({ getState }) => next => action => {
  const previousState = getState();
  const result = next(action);
  const nextState = getState();

  console.groupCollapsed(
    `%c${action.type}`,
    "font-weight:bold;font-size:14;color:rgb(23, 162, 184)"
  );
  console.log("%cPrevious state: ", "font-weight:bold", previousState);
  console.log("%cAction: ", "font-weight:bold", action);
  console.log("%cNext state: ", "font-weight:bold", nextState);
  console.groupEnd();
  return result;
};

export const useRedux = (reducer, _middleware = []) => {
  const stateRef = useRef(reducer(undefined, { type: "@INIT" }));
  const [state, setState] = useState(stateRef.current);

  const store = useRef(
    (() => {
      const store = { getState: () => stateRef.current };
      store.dispatch = [thunk, logger, ..._middleware]
        .reverse()
        .map(ware => ware(store))
        .reduce(
          (next, ware) => ware(next),
          action => {
            stateRef.current = reducer(stateRef.current, action);
            setState(stateRef.current);
          }
        );

      return store;
    })()
  );

  return store.current;
};

export const useStyle = style => {
  const css = useContext(StyleContext);
  const [classes, setClasses] = useState({});

  useLayoutEffect(() => {
    const applied = css.apply(style);
    setClasses(applied.classes);

    () => css.remove(applied.css);
  }, []);

  return classes;
};

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    };

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const useAnimationFrame = callback => {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const loop = () => {
    frameRef.current = requestAnimationFrame(loop);
    const cb = callbackRef.current;
    cb();
  };

  const frameRef = useRef();
  useLayoutEffect(() => {
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);
};
