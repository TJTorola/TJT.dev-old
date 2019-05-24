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
  const worker = useContext(WorkerContext);
  useEffect(() => {
    const subId = worker.subscribe(setRenderInfo);
    return () => worker.unsubscribe(subId);
  }, []);

  return !renderInfo
    ? h(LoadingMaze, { setRenderInfo })
    : h(LoadedMaze, { renderInfo, setTotalSteps, step });
};

const LoadingMaze = () => {
  const worker = useContext(WorkerContext);
  useEffect(() => {
    worker.send({
      type: "SETUP",
      payload: {
        maxWidth: window.innerWidth - SC.SPACING.NAV_WIDTH - 64,
        maxHeight: window.innerHeight - SC.SPACING.CONTROL_HEIGHT - 64,
        cellSize: 10,
        wallSize: 1
      }
    });
  }, []);

  return h(Loader);
};

const LoadedMaze = ({ renderInfo, setTotalSteps, step }) => {
  const [ctx, setCtx] = useState(null);
  const ref = useCallback(canvas => {
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      setCtx(ctx);
    }
  });

  useEffect(() => {
    if (ctx) {
      const { buffer, width, height } = renderInfo;

      if (buffer) {
        ctx.putImageData(new ImageData(buffer, width, height), 0, 0);
      } else {
        ctx.fillRect(0, 0, width, height);
      }
    }
  }, [renderInfo, ctx]);

  return h(Fragment, {},
    h("canvas", {
      ref,
      width: renderInfo.width,
      height: renderInfo.height
    }),
    renderInfo.stepCount === 0 ? h(Loader) : null
  );
};
