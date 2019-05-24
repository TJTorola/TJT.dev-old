import { h } from "./react.mjs";

export const Play = ({ size }) =>
  h(
    "svg",
    { viewBox: "0 0 16 16", width: size, height: size },
    h("polygon", { points: "0,0 16,8 0,16" })
  );

export const Pause = ({ size }) =>
  h(
    "svg",
    { viewBox: "0 0 16 16", width: size, height: size },
    h("polygon", { points: "2,0 2,16 6,16 6,0" }),
    h("polygon", { points: "10,0 10,16 14,16 14,0" })
  );
