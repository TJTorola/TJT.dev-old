import { StrictMode } from "react";
import ReactDOM from "react-dom";

ReactDOM.render(
  <StrictMode>
    <div>Hello World!!</div>
  </StrictMode>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
