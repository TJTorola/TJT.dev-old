importScripts("./pkg/a_maze.js");

delete WebAssembly.instantiateStreaming;
pkg("./pkg/a_maze_bg.wasm").then(
  wasm => {
    pkg.a_maze_init();
    const { Maze, Generator } = pkg;

    let maze;
    const postRender = id => {
      postMessage({
        id,
        payload: {
          buffer: new Uint8ClampedArray(
            wasm.memory.buffer,
            maze.image_data(),
            maze.width() * maze.height() * 4
          )
        }
      });
    };

    onmessage = ({ data: { type, payload, id } }) => {
      switch (type) {
        case "SETUP": {
          const { cellSize, wallSize, maxWidth, maxHeight } = payload;
          maze = pkg.Maze.new(cellSize, wallSize, maxWidth, maxHeight);
          postRender(id);
          break;
        }

        case "SET_STEP": {
          maze.set_step(payload);
          postRender(id);
          break;
        }

        case "SET_GENERATOR": {
          const generator = {
            hilburt: Generator.Hilburt,
            random: Generator.Random,
            test: Generator.Test
          }[payload];

          if (generator === undefined) {
            postMessage({
              id,
              error: `Unknown generator payload '${payload}'`
            });
          } else {
            maze.set_generator(generator);
            postRender(id);
          }

          break;
        }

        default: {
          postMessage({
            id,
            error: `Unknown message type '${type}'`
          });
          break;
        }
      }
    };

    postMessage({
      id: "init",
      payload: { initialized: true }
    });
  },
  error => {
    postMessage({
      id: "init",
      error
    });
  }
);
