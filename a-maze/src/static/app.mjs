import { SCHEME as SC } from "./constants.mjs";
import { useAnimationFrame, useLocation, useRedux, useStyle, getHashRoute } from "./hooks.mjs";
import * as icons from "./icons.mjs";
import { Loader } from "./loader.mjs";
import { h, useCallback, useEffect, useRef, useState } from "./react.mjs";
import { clamp, m } from "./lib/util.mjs";

const mazeManager = ({ bridge, ctx }) => {
  const setImage = () => {
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
    ...mazeState,
    [field]: action.payload,
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
        ...mazeState,
        generator: action.payload,
        playing: false,
        step: 0,
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

const useMaze = ({ cellSize, wallSize, contentSize }) => {
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
    if (!store.getState().loading) return;

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
      store.dispatch({ type: "LOADED", payload: maze });
    })();
  }, [contentSize]);

  useAnimationFrame(() => {
    const state = store.getState();

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

const STYLE = `
hr {
  border-color: ${SC.COLORS.GRAY.M};
  border-top: 0;
  border-width: 1px;
}

button {
  background: inherit;
  border: 0;
  cursor: pointer;
  padding: 0;
}

canvas {
  border: ${SC.SPACING.XS} solid black;
}

~content {
  align-items: center;
  background: ${SC.COLORS.GRAY.L};
  display: flex;
  flex-grow: 1;
  justify-content: center;
}

~control {
  fill: ${SC.COLORS.GRAY.S};
  margin: ${SC.SPACING.XS};
}

~control:hover {
  fill: ${SC.COLORS.GRAY.M};
}

~control:active {
  fill: ${SC.COLORS.GRAY.S};
}

~control svg {
  display: block;
}

~header {
  align-items: center;
  border-bottom: solid ${SC.COLORS.GRAY.M} 1px;
  display: flex;
  flex-direction: row;
  grid-area: 1 / 2;
  justify-content: space-between;
  padding: 0 ${SC.SPACING.M};
}

~links {
  padding-bottom: ${SC.SPACING.L};
  padding-top: ${SC.SPACING.S};
}

~links li {
  margin-bottom: ${SC.SPACING.XS};
}

~main {
  display: grid;
  font-family: Helvetica, Arial, sans-serif;
  grid-template-columns: ${SC.SPACING.NAV_WIDTH} auto;
  grid-template-rows: ${SC.SPACING.CONTROL_HEIGHT} auto;
  height: 100%;
  min-height: ${SC.SPACING.MIN_APP_HEIGHT};
  min-width: ${SC.SPACING.MIN_APP_WIDTH};
  width: 100%;
}

~nav {
  border-right: solid ${SC.COLORS.GRAY.M} 1px;
  grid-area: 2 / 1;
  padding-left: ${SC.SPACING.M};
  padding-top: ${SC.SPACING.M};
}

~section {
  grid-area: 2 / 2;
}

~slider {
  width: 100%;
}

~subheader {
  margin-bottom: ${SC.SPACING.XS};
}

~title {
  align-items: center;
  border-bottom: solid ${SC.COLORS.GRAY.M} 1px;
  border-right: solid ${SC.COLORS.GRAY.M} 1px;
  display: flex;
  grid-area: 1 / 1;
  justify-content: center;
  margin: 0;
}`;

const LiAnchor = ({ children, href }) =>
  h("li", {}, h("a", { href }, children));

export const App = () => {
  const loc = useLocation();
  const classes = useStyle(STYLE);
  const contentRef = useRef();
  const [contentSize, setContentSize] = useState(null);
  useEffect(() => {
    // Wait until content class exists to set contentSize
    if (!!classes.content) {
      setContentSize({
        width: contentRef.current.clientWidth,
        height: contentRef.current.clientHeight
      });
    }
  }, [classes]);

  const { store: { dispatch, getState }, canvasRef } = useMaze({
    cellSize: 16,
    wallSize: 4,
    contentSize
  });

  useEffect(() => {
    dispatch({ type: "LOCATION", payload: loc });
  }, [loc]);

  return h(
    "main",
    { className: classes.main },
    h("div", { className: classes.title }, h("h1", {}, "A Maze")),
    h(
      "header",
      { className: classes.header },
      h(
        "button",
        {
          className: classes.control,
          onClick: () => dispatch({ type: "PLAYING", payload: !getState().playing })
        },
        h(getState().playing ? icons.Pause : icons.Play, { size: 23 })
      ),
      h("input", {
        className: classes.slider,
        type: "range",
        min: 0,
        max: getState().stepCount ? getState().stepCount - 1 : 0,
        value: getState().step || 0,
        onChange: e => {
          const stepNum = parseInt(e.target.value);
          const nextStep = clamp(0, getState().stepCount)(stepNum);
          if (getState().step !== nextStep) {
            dispatch({ type: "STEP", payload: nextStep });
          }
        }
      })
    ),
    h(
      "nav",
      { className: classes.nav },
      h("h2", { className: classes.subheader }, "Generators"),
      h("hr"),
      h(
        "ul",
        { className: classes.links },
        h(
          LiAnchor,
          { href: getHashRoute({ generator: "hilburt" }) },
          "Hilburt's Curve"
        ),
        h(LiAnchor, { href: getHashRoute({ generator: "random" }) }, "Random"),
        h(LiAnchor, { href: getHashRoute({ generator: "test" }) }, "Test")
      )
    ),
    h(
      "section",
      { className: classes.content, ref: contentRef },
      getState().loading
        ? h(Loader)
        : h("canvas", {
            ref: canvasRef,
            width: getState().width,
            height: getState().height
          })
    )
  );
};
