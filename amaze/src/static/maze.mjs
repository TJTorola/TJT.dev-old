import { useCtx } from "./hooks.mjs";
import { Loader } from "./loader.mjs";
import { h, useEffect } from "./react.mjs";

export const Maze = ({ loading, setImage, step, width, height }) => {
  const { ctx, ref } = useCtx();
  useEffect(() => {
    if (ctx && !loading) {
      setImage(ctx);
    }
  }, [ctx, step, loading]);

  return loading ? h(Loader) : h("canvas", { ref, width, height });
};
