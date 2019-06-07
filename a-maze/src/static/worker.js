importScripts("./pkg/a_maze.js");
delete WebAssembly.instantiateStreaming;

const middleware = (store, next) => action => {
  switch (action.type) {
    case "SETUP": {
      const { cellSize, wallSize, maxWidth, maxHeight } = action.payload;
      const maze = pkg.Maze.new(cellSize, wallSize, maxWidth, maxHeight);

      const res = next({
        type: "SETUP",
        payload: {
          generator: action.payload.generator,
          maze
        }
      });

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
    case "SETUP": {
      const { generator, maze } = action.payload;
      return { generator, maze };
    }

    case "SET_GENERATOR": {
      return { generator: action.payload };
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
