importScripts("./pkg/a_maze.js");

delete WebAssembly.instantiateStreaming;
pkg("./pkg/a_maze_bg.wasm").then(
  wasm => {
    pkg.a_maze_init();
    const { Maze, Generator } = pkg;

    let maze;
    let generator;
    const postRender = id => {
      const width = maze.width();
      const height = maze.height();
      postMessage({
        id,
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
          const newGenerator = {
            hilburt: Generator.Hilburt,
            random: Generator.Random,
            test: Generator.Test
          }[payload];

          if (newGenerator === undefined) {
            postMessage({
              id,
              error: `Unknown generator payload '${payload}'`
            });
          } else {
            generator = newGenerator;

            if (maze === undefined) {
              postMessage({ id, payload: { set: true } });
            } else {
              maze.set_generator(generator);
              postRender(id);
            }
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
