import { Loader } from "./loader.mjs";
import { h } from './react.mjs';

export const Maze = ({ loading, imageData, step }) => {
  if (loading) return h(Loader);
  return h('div', {}, 'Loaded!');
}
