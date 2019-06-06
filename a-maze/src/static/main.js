class AMaze {
  constructor() {
    this.elements = {
      app: document.getElementById("app"),
      playButton: document.getElementById("play-button"),
      stepSlider: document.getElementById("step-slider"),
      canvasBg: document.getElementById("canvas-bg")
    };

    this.handlers = {
      INITIALIZED: this.initialized.bind(this)
    };

    this.worker = new Worker("./worker.js");
    this.worker.onmessage = message => {
      const handler = this.handlers[message.data.type];

      if (!handler) {
        throw new Error(`Un-handled message, '${data.type}'`);
      } else {
        handler(message.data.payload);
      }
    };
  }

  getGenerator() {
    const { hash } = window.location;
    const route = hash.length > 0 ? hash.slice(1) : "";
    return route.split("/")[0];
  }

  initialized(payload) {
    if (!payload.success) {
      console.error("Could not initialize WASM");
      throw new Error(payload.error);
    }

    this.setAppStatus("initialized");
    this.worker.postMessage({
      type: "SETUP",
      payload: { generator: this.getGenerator() }
    });

    window.addEventListener("hashchange", () => {
      this.worker.postMessage({
        type: "SET_GENERATOR",
        payload: this.getGenerator()
      });
    });
  }

  setAppStatus(status) {
    this.elements.app.setAttribute("data-status", status);
  }
}

window.aMaze = new AMaze();
