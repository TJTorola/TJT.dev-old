importScripts("./pkg/a_maze.js");
delete WebAssembly.instantiateStreaming;

const middleware = (store, next) => action => {
  switch (action.type) {
    default:
      return next(action);
  }
};

const reducer = (state, action) => {
  switch (action.type) {
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
