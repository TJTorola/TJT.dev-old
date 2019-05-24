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
  const [loading, setLoading] = useState(true);

  return loading
    ? h(LoadingMaze, { setLoading })
    : h(LoadedMaze)
};

const LoadingMaze = ({ setLoading }) => {
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
    }).then(() => {
      setLoading(false);
    });
  }, []);
  
  return h(Loader);
};

const LoadedMaze = () => {
  return h('canvas');
};

