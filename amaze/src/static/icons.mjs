import { h } from "./react.mjs";

export const Play = ({ size }) =>
  h("svg", { viewBox: "0 0 16 16", width: size, height: size },
    h("polygon", { points: "0,0 16,8 0,16" })
  );
