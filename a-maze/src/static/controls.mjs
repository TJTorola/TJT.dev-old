import { SCHEME as SC } from "./constants.mjs";
import { WorkerContext } from "./context.mjs";
import { useStyle } from "./hooks.mjs";
import * as icons from "./icons.mjs";
import { h, useContext, useEffect, useState, Fragment } from "./react.mjs";

const STYLE = `
~control {
  fill: ${SC.COLORS.GRAY.S};
  margin: ${SC.SPACING.XS};
}

~control:hover {
  fill: ${SC.COLORS.GRAY.M};
}

~control:active {
  fill: ${SC.COLORS.GRAY.S};
}

~control svg {
  display: block;
}

~slider {
  width: 100%;
}`;

export const Controls = () => {
  const classes = useStyle(STYLE);
  const [renderInfo, setRenderInfo] = useState();
  const worker = useContext(WorkerContext);
  useEffect(() => {
    const subId = worker.subscribe(setRenderInfo);
    return () => worker.unsubscribe(subId);
  }, []);


  if (!renderInfo || renderInfo.stepCount <= 1) {
    return null;
  } else {
    return h(
      Fragment,
      {},
      h(
        "button",
        {
          className: classes.control
        },
        h(false ? icons.Pause : icons.Play, { size: 23 })
      ),
      h("input", {
        className: classes.slider,
        type: "range",
        min: 0,
        max: renderInfo.stepCount - 1,
      })
    );
  }
};

