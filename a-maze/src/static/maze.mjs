import { SCHEME as SC } from "./constants.mjs";
import { WorkerContext } from "./context.mjs";
import {
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

const LoadedMaze = ({ renderInfo }) => {
  const [ctx, setCtx] = useState(null);
  const ref = useCallback(canvas => {
    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      setCtx(ctx);
      putImage(ctx, renderInfo);
    }
  });

  return h("canvas", {
    ref,
    width: renderInfo.width,
    height: renderInfo.height
  });
};
