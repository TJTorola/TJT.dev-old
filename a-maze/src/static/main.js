class AMaze {
  constructor() {
    this.elements = {
      playButton: document.getElementById("play-button"),
      stepSlider: document.getElementById("step-slider"),
      canvasBg: document.getElementById("canvas-bg")
    };

    this.onMessage = this.onMessage.bind(this);

    this.loadWorker();
  }

  loadWorker() {
    this.worker = new Worker("./worker.js");
    this.worker.onmessage = this.onMessage;
  }

  onMessage(message) {
    const { data } = message;

    switch (data.type) {
      case "INITIALIZED": {
        if (data.payload.success) {
          document.body.classList.remove('isLoading');
        } else {
          console.error("Could not initialize WASM");
          throw new Error(data.payload.error);
        }

        break;
      }

      default: {
        throw new Error(`Un-handled message, '${data.type}'`);
      }
    }
  }
}

new AMaze();
