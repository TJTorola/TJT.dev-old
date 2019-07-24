importScripts("./pkg/a_maze.js");
delete WebAssembly.instantiateStreaming;

const { Maze, Generator } = pkg;

const GENERATOR_MAP = {
  hilburt: Generator.Hilburt,
  random: Generator.Random,
  rows: Generator.Rows
};

const middleware = (store, next) => action => {
  switch (action.type) {
    case "SET_GENERATOR": {
      const prev = store.getState().generator;
      const res = next(action);
      const { generator, maze } = store.getState();

      if (prev !== generator) {
        maze.set_generator(generator);

        postMessage({
          type: "STEP_COUNT_CHANGE",
          payload: {
            stepCount: maze.step_count()
          }
        });
      }

      return res;
    }

    case "SET_STEP": {
      const { maze, width, height, wasm } = store.getState();

      maze.set_step(action.payload);
      postMessage({
        type: "RENDER",
        payload: {
          buffer: new Uint8ClampedArray(
            wasm.memory.buffer,
            maze.image_data(),
            width * height * 4
          ),
          width,
          height
        }
      });

      return;
    }

    case "SETUP": {
      const { cellSize, wallSize, maxWidth, maxHeight } = action.payload;
      const maze = pkg.Maze.new(cellSize, wallSize, maxWidth, maxHeight);

      const res = next({
        type: "SET_MAZE",
        payload: maze
      });

      if (action.payload.generator) {
        store.dispatch({
          type: "SET_GENERATOR",
          payload: action.payload.generator
        });
      }

      const { width, height } = store.getState();
      postMessage({
        type: "SETUP_COMPLETE",
        payload: {
          width,
          height
        }
      });

      return res;
    }

    default:
      return next(action);
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_MAZE": {
      const maze = action.payload;
      return { ...state, maze, width: maze.width(), height: maze.height() };
    }

    case "SET_GENERATOR": {
      return {
        ...state,
        generator: GENERATOR_MAP[action.payload]
      };
    }

    default:
      return state;
  }
};

const makeStore = wasm => {
  let state = { wasm };
  const store = { getState: () => state };
  store.dispatch = middleware(store, action => {
    const newState = reducer(state, action);
    state = newState;
  });

  return store;
};

pkg("./pkg/a_maze_bg.wasm").then(
  wasm => {
    pkg.a_maze_init();
    const store = makeStore(wasm);
    onmessage = ({ data }) => store.dispatch(data);
    postMessage({
      type: "INITIALIZED",
      payload: { success: true }
    });
  },
  error => {
    postMessage({
      type: "INITIALIZED",
      payload: { success: false, error }
    });
  }
);
