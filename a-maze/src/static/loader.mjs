// CSS Credit: @tobiasahlin, https://tobiasahlin.com/spinkit/

import { SCHEME as SC } from "./constants.mjs";
import { useStyle } from "./hooks.mjs";
import { h, forwardRef } from "./react.mjs";

const DEFAULT_SIZE = 60;
const DEFAULT_COLOR = SC.COLORS.GRAY.S;

const STYLE = `
~grid {
  bottom: 0;
  left: 0;
  margin: auto;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
}

~grid div {
  width: 33.3%;
  height: 33.3%;
  float: left;
  animation: cubeBounce 1.3s infinite ease-in-out; 
}

~grid div:nth-child(1) { animation-delay: 0.2s; }
~grid div:nth-child(2) { animation-delay: 0.3s; }
~grid div:nth-child(3) { animation-delay: 0.4s; }
~grid div:nth-child(4) { animation-delay: 0.1s; }
~grid div:nth-child(5) { animation-delay: 0.2s; }
~grid div:nth-child(6) { animation-delay: 0.3s; }
~grid div:nth-child(7) { animation-delay: 0.0s; }
~grid div:nth-child(8) { animation-delay: 0.1s; }
~grid div:nth-child(9) { animation-delay: 0.2s; }

@keyframes cubeBounce {
  0%, 70%, 100% {
    transform: scale3D(1, 1, 1);
  }
  35% {
    transform: scale3D(0, 0, 1);
  } 
}`;

export const Loader = ({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }) => {
  const classes = useStyle(STYLE);

  return h(
    "div",
    { className: classes.grid, style: { width: size, height: size } },
    [...new Array(9)].map((_, i) =>
      h("div", { key: i, style: { background: color } })
    )
  );
};
