import { h } from "./preact.mjs";

export const Play = ({ fill, size }) =>
  h("svg", { viewBox: "0 0 16 16", width: size, height: size }, [
    h("polygon", { fill, points: "0,0 16,8 0,16" })
  ]);
