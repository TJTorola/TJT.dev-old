import { StyleContext } from "./context.mjs";
import {
  useContext,
  useCallback,
  useRef,
  useState,
  useEffect,
  useLayoutEffect
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

const getLocation = () => ({
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
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const useMaze = ({ cellSize, maxWidth, maxHeight }) => {
  const [loading, setLoading] = useState(true);
  const [maze, setMaze] = useState(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [stepCount, setStepCount] = useState(null);
  const [step, _setStep] = useState(0);
  const [playing, _setPlaying] = useState(false);
  const [playingInterval, setPlayingInterval] = useState(null);

  useEffect(() => {
    (async () => {
      const pkg = await import("./pkg/index.js");
      const wasm = await pkg.default("./pkg/index_bg.wasm");

      const maze = pkg.Maze.new(cellSize, maxWidth, maxHeight);
      const imageData = new ImageData(
        new Uint8ClampedArray(
          wasm.memory.buffer,
          maze.image_data(),
          maze.width() * maze.height() * 4
        ),
        maze.width(),
        maze.height()
      );

      setImageData(imageData);
      setMaze(maze);
      setWidth(maze.width());
      setHeight(maze.height());
      setStepCount(maze.stepCount());

      setLoading(false);
    })();
  }, []);

  const setPlaying = newPlaying => {
    if (!maze) {
      throw new Error("Cannot setPlaying before maze is loaded");
    }
    if (step === stepCount - 1 && newPlaying) return;

    _setPlaying(newPlaying);
  };

  useInterval(() => {
    if (step < stepCount - 1) {
      maze.set_step(step + 1);
      _setStep(step + 1);
    } else {
      setPlaying(false);
    }
  }, playing ? 20 : null);

  const setStep = newStep => {
    const newStepNum = parseInt(newStep, 10);
    if (!maze) {
      throw new Error("Cannot setStep before maze is loaded");
    }
    if (0 > newStepNum || newStepNum >= stepCount) {
      throw new Error("New step is out of bounds");
    }

    maze.set_step(newStepNum);
    _setStep(newStepNum);
    if (playing) {
      setPlaying(false);
    }
  };

  return {
    imageData,
    width,
    height,
    loading,
    stepCount,
    step,
    setStep,
    playing,
    setPlaying
  };
};

export const useCtx = () => {
  const [ctx, setCtx] = useState(null);
  const ref = useCallback(canvas => {
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      setCtx(ctx);
    }
  }, []);

  return { ref, ctx };
};
