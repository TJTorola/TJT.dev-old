import { App } from "./app.mjs";
import { WorkerContext, StyleContext, Css } from "./context.mjs";
import { h, composeContext, render, unmount } from "./react.mjs";

class AMaze extends HTMLElement {
  constructor() {
    super();

    this.css = new Css();
    this.msgId = 0;
    this.subscriberId = 0;
    this.resolves = [];
    this.rejects = [];
    this.subscribers = [];
  }

  loadWorker() {
    this.worker = new Worker("./worker.js");
    this.worker.onmessage = this.onMessage.bind(this);

    return new Promise((res, rej) => {
      this.resolves["init"] = res;
      this.rejects["init"] = rej;
    });
  }

  onMessage({ data }) {
    const { id, error, payload } = data;

    if (id === "render") {
      Object.values(this.subscribers).forEach(sub => sub(payload));
      return;
    } else if (payload) {
      const res = this.resolves[id];
      if (res) {
        res(payload);
      } else {
        throw new Error(`LOST_MESSAGE: ${JSON.stringify(data)}`);
      }
    } else {
      const rej = this.rejects[id];
      if (rej) {
        rej(error || `MALFORMED_RESPONSE: ${JSON.stringify(data)}`);
      } else {
        throw new Error(`LOST_MESSAGE: ${JSON.stringify(data)}`);
      }
    }

    if (id) {
      delete this.resolves[id];
      delete this.rejects[id];
    }
  }

  subscribe(subscriber) {
    const id = this.subscriberId++;
    this.subscribers[id] = subscriber;

    return id;
  }

  unsubscribe(id) {
    delete this.subscribers[id];
  }

  send({ type, payload }) {
    const id = this.msgId++;
    return new Promise((res, rej) => {
      this.resolves[id] = res;
      this.rejects[id] = rej;

      this.worker.postMessage({
        id,
        type,
        payload
      });
    });
  }

  async connectedCallback() {
    await this.loadWorker();
    this.css.mount();

    render(
      composeContext(
        [
          [
            WorkerContext,
            {
              send: this.send.bind(this),
              subscribe: this.subscribe.bind(this),
              unsubscribe: this.unsubscribe.bind(this)
            }
          ],
          [StyleContext, this.css]
        ],
        h(App)
      ),
      this
    );
  }

  disconnectedCallback() {
    this.css.unmount();
    this.worker.terminate();
    unmount(this);
  }
}

customElements.define("a-maze", AMaze);
