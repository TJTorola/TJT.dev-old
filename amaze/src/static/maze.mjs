import { useCtx } from "./hooks.mjs";
import { Loader } from "./loader.mjs";
import { h, useEffect } from "./react.mjs";

export const Maze = ({ loading, imageData, step, width, height }) => {
  const { ctx, ref } = useCtx();
  useEffect(() => {
    if (ctx && imageData) {
      ctx.putImageData(imageData, 0, 0);
    }
  }, [ctx, step, imageData]);

  return loading ? h(Loader) : h("canvas", { ref, width, height });
};
