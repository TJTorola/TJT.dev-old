import { StyleContext } from "./context.mjs";
import { useContext, useCallback, useState, useEffect } from "./react.mjs";

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

  useEffect(() => {
    const applied = css.apply(style);
    setClasses(applied.classes);

    () => css.remove(applied.css);
  }, []);

  return classes;
};

export const useMaze = ({ cellSize, maxWidth, maxHeight }) => {
  const [loading, setLoading] = useState(true);
  const [maze, setMaze] = useState(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [stepCount, setStepCount] = useState(null);
  const [step, _setStep] = useState(0);

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
  };

  return { imageData, width, height, loading, stepCount, step, setStep };
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
