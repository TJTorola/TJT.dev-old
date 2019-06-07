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
      console.log(store.getState());

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

      postMessage({
        type: "SETUP_COMPLETE",
        payload: {
          width: maze.width(),
          height: maze.height()
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
      return { ...state, maze: action.payload };
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

const makeStore = () => {
  let state = {};
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
    const store = makeStore();
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
