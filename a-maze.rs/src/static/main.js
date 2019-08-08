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
const CTX = {
  bg: ELEMENTS.canvasBg.getContext("2d")
};
CTX.bg.imageSmoothingEnabled = false;

// ----------------
// UTILITIES -------------
// ---------------------------------------------------

const getGenerator = () => {
  const { hash } = window.location;
  const route = hash.length > 0 ? hash.slice(1) : "";
  return route.split("/")[0];
};

// ----------------
// MAIN LOOP -------------
// ---------------------------------------------------

let LAST_STEP = null;
let WORKING = false;
setInterval(() => {
  if (
    !WORKING
    && ELEMENTS.controlWrapper.dataset.status === "playable"
    && ELEMENTS.stepSlider.value !== LAST_STEP
  ) {
    LAST_STEP = ELEMENTS.stepSlider.value;
    WORKING = true;
    WORKER.postMessage({
      type: "SET_STEP",
      payload: parseInt(LAST_STEP, 10)
    });
  }
}, 20);

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

const render = ({ buffer, width, height }) => {
  CTX.bg.putImageData(new ImageData(buffer, width, height), 0, 0);
  WORKING = false;
};

const setupComplete = ({ width, height }) => {
  ELEMENTS.canvasBg.width = width;
  ELEMENTS.canvasBg.height = height;
  ELEMENTS.app.setAttribute("data-status", "loaded");
};

const stepCountChange = ({ stepCount }) => {
  if (stepCount > 0) {
    ELEMENTS.controlWrapper.setAttribute("data-status", "playable");
    ELEMENTS.stepSlider.value = 0;
    ELEMENTS.stepSlider.max = stepCount - 1;
  } else {
    ELEMENTS.controlWrapper.setAttribute("data-status", "unplayable");
  }
};

const HANDLERS = {
  INITIALIZED: initialized,
  RENDER: render,
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
