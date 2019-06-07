const CELL_SIZE = 10;
const WALL_SIZE = 1;
const PADDING = 64;

const ELEMENTS = {
  app: document.getElementById("app"),
  canvasBg: document.getElementById("canvas-bg"),
  contentWrapper: document.getElementById("content-wrapper"),
  controlWrapper: document.getElementById("control-wrapper"),
  playButton: document.getElementById("play-button"),
  stepSlider: document.getElementById("step-slider")
};

// ----------------
// UTILITIES -------------
// ---------------------------------------------------

const getGenerator = () => {
  const { hash } = window.location;
  const route = hash.length > 0 ? hash.slice(1) : "";
  return route.split("/")[0];
};

// ----------------
// MSG HANDLERS ----------
// ---------------------------------------------------

const initialized = payload => {
  if (!payload.success) {
    console.error("Could not initialize WASM");
    throw new Error(payload.error);
  }

  WORKER.postMessage({
    type: "SETUP",
    payload: {
      cellSize: CELL_SIZE,
      wallSize: WALL_SIZE,
      maxHeight: ELEMENTS.contentWrapper.clientHeight - PADDING,
      maxWidth: ELEMENTS.contentWrapper.clientWidth - PADDING,
      generator: getGenerator()
    }
  });

  window.addEventListener("hashchange", () => {
    WORKER.postMessage({
      type: "SET_GENERATOR",
      payload: getGenerator()
    });
  });
};

const setupComplete = ({ width, height }) => {
  ELEMENTS.canvasBg.width = width;
  ELEMENTS.canvasBg.height = height;
  ELEMENTS.app.setAttribute("data-status", "loaded");
};

const stepCountChange = ({ stepCount }) => {
  ELEMENTS.controlWrapper.setAttribute(
    "data-status",
    stepCount > 0 ? "playable" : "unplayable"
  );
};

const HANDLERS = {
  INITIALIZED: initialized,
  STEP_COUNT_CHANGE: stepCountChange,
  SETUP_COMPLETE: setupComplete
};

// ----------------
// WORKER SETUP ----------
// ---------------------------------------------------

const WORKER = new Worker("./worker.js");
WORKER.onmessage = message => {
  const handler = HANDLERS[message.data.type];

  if (!handler) {
    throw new Error(`Un-handled message, '${data.type}'`);
  } else {
    handler(message.data.payload);
  }
};
