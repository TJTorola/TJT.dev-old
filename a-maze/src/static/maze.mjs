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

export const Maze = () => {
  const [renderInfo, setRenderInfo] = useState();

  return !renderInfo
    ? h(LoadingMaze, { setRenderInfo })
    : h(LoadedMaze, { renderInfo });
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

// Hook up canvas.ctx state and put the initial image
const useCanvasContext = renderInfo => {
  const [ctx, setCtx] = useState(null);
  const ref = useCallback(canvas => {
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      setCtx(ctx);
      putImage(ctx, renderInfo);
    }
  });

  return { ctx, ref };
};

// Keep tabs on location and sync with worker as needed
const useGeneratorLoc = ctx => {
  const worker = useContext(WorkerContext);
  const loc = useLocation();
  const ctxRef = useRef(ctx);
  const [loading, setLoading] = useState(false);

  if (ctxRef.current !== ctx) {
    ctxRef.current = ctx;
  }

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

  return { loading };
};

const LoadedMaze = ({ renderInfo }) => {
  const { ctx, ref } = useCanvasContext(renderInfo);
  const { loading } = useGeneratorLoc(ctx);

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
