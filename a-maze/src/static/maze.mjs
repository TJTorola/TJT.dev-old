import { useRedux } from "./hooks.mjs";
import { useCallback, useReducer, useRef } from "./react.mjs";

const mazeManager = ({ bridge, ctx }) => {
  const setImage () => {
    if (ctx.current) {
      const { wasm, maze } = bridge.current;
      const imageData = new ImageData(
        new Uint8ClampedArray(
          wasm.memory.buffer,
          maze.image_data(),
          maze.width() * maze.height() * 4
        ),
        maze.width(),
        maze.height()
      );

      ctx.current.putImageData(imageData, 0, 0);
    }
  };

  return store => next => action => {
    if (!bridge.current) return next(action);

    switch (action.type) {
      case "LOADED": {
        setImage();
        break;
      }

      case "GENERATOR": {
        const { maze } = bridge.current;
        maze.set_generator(action.payload);
        setImage();
        store.dispatch({ type: "STEP_COUNT", payload: maze.step_count() });
        break;
      }

      case "STEP": {
        const { maze } = bridge.current;
        maze.set_step(action.payload);
        setImage();
        break;
      }

      case "LOCATION": {
        const loc = action.payload;
        const { Generator } = bridge.current;
        const generator = {
          hilburt: Generator.Hilburt,
          random: Generator.Random,
          test: Generator.Test
        }[loc.params.generator];

        if (generator !== undefined) {
          store.dispatch({ type: "GENERATOR", payload: generator });
        }
        break;
      }
    }

    next(action);
  };
}

const INITIAL_STATE = { loading: true };
const reducer = (mazeState = INITIAL_STATE, action) => {
  const setField = field => () => ({
    [field]: action.payload,
    ...mazeState
  });

  const ifLoaded = cb => {
    if (!mazeState.loading) {
      return cb();
    } else {
      throw new Error(`Cannot dispatch ${action.type} when maze is not loaded`);
    }
  };

  switch (action.type) {
    case "GENERATOR":
      return ifLoaded(() => ({
        generator: action.payload,
        playing: false,
        step: 0,
        ...mazeState
      }));

    case "LOADED": {
      const maze = action.payload;

      return {
        height: maze.height(),
        loading: false,
        playing: false,
        step: 0,
        stepCount: maze.step_count(),
        width: maze.width(),
        generator: mazeState.generator
      };
    }

    case "PLAYING":
      return ifLoaded(setField("playing"));

    case "PLAYING_INTERVAL":
      return ifLoaded(setField("playingInterval"));

    case "STEP":
      return ifLoaded(setField("step"));

    case "STEP_COUNT":
      return ifLoaded(setField("stepCount"));

    default:
      return mazeState;
  }
};

export const useMaze = ({ cellSize, wallSize, contentSize }) => {
  const bridge = useRef();
  const ctx = useRef();
  const canvasRef = useCallback(canvas => {
    if (canvas) {
      ctx.current = canvas.getContext("2d");
      ctx.current.imageSmoothingEnabled = false;
    }
  }, []);

  const store = useRedux(reducer, [mazeManager({ ctx, bridge })]);

  useEffect(() => {
    // Allow the app to calculate w & h before initializing the maze
    if (!contentSize) return;

    // Don't recalculate if size changes
    if (!getState().loading) return;

    (async () => {
      const pkg = await import("./pkg/index.js");
      const wasm = await pkg.default("./pkg/index_bg.wasm");
      pkg.a_maze_init();
      const maze = pkg.Maze.new(
        cellSize,
        wallSize,
        contentSize.width - 64,
        contentSize.height - 64
      );
      bridge.current = { wasm, maze, Generator: pkg.Generator };
      dispatch({ type: "LOADED", payload: maze });
    })();
  }, [contentSize]);

  useAnimationFrame(() => {
    const state = getState();

    if (state.playing) {
      const { step, stepCount } = state;

      if (step < stepCount - 1) {
        bridge.current.maze.set_step(step + 1);
        store.dispatch({ type: "STEP", payload: step + 1 });
      } else {
        store.dispatch({ type: "PLAYING", payload: false });
      }
    }
  });

  return {
    canvasRef,
    store
  };
};
