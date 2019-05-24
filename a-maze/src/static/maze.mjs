import { SCHEME as SC } from "./constants.mjs";
import { WorkerContext } from "./context.mjs";
import { useLocation } from "./hooks.mjs";
import {
  Fragment,
  h,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback
} from "./react.mjs";
import { Loader } from "./loader.mjs";

export const Maze = ({ setTotalSteps, step }) => {
  const [renderInfo, setRenderInfo] = useState();

  return !renderInfo
    ? h(LoadingMaze, { setRenderInfo })
    : h(LoadedMaze, { renderInfo, setTotalSteps, step });
};

const LoadingMaze = ({ setRenderInfo }) => {
  const worker = useContext(WorkerContext);
  useEffect(() => {
    worker
      .send({
        type: "SETUP",
        payload: {
          maxWidth: window.innerWidth - SC.SPACING.NAV_WIDTH - 64,
          maxHeight: window.innerHeight - SC.SPACING.CONTROL_HEIGHT - 64,
          cellSize: 10,
          wallSize: 1
        }
      })
      .then(renderInfo => {
        setRenderInfo(renderInfo);
      });
  }, []);

  return h(Loader);
};

const putImage = (ctx, { buffer, width, height }) =>
  ctx.putImageData(new ImageData(buffer, width, height), 0, 0);

const LoadedMaze = ({ renderInfo, setTotalSteps, step }) => {
  // Hook up canvas.ctx state and put the initial image
  const [ctx, setCtx] = useState(null);
  const ctxRef = useRef(ctx);

  const ref = useCallback(canvas => {
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      setCtx(ctx);
      ctxRef.current = ctx;
      putImage(ctx, renderInfo);
    }
  });

  // Keep tabs on location and sync with worker as needed
  const worker = useContext(WorkerContext);
  const loc = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loc.params.generator) {
      setLoading(true);
      worker
        .send({ type: "SET_GENERATOR", payload: loc.params.generator })
        .then(resp => {
          setLoading(false);
          if (resp.buffer) {
            putImage(ctxRef.current, resp);
          }
        });
    }
  }, [loc]);

  return h(
    Fragment,
    {},
    h("canvas", {
      ref,
      width: renderInfo.width,
      height: renderInfo.height
    }),
    loading ? h(Loader) : null
  );
};
