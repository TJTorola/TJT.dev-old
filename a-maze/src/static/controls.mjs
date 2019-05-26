import { SCHEME as SC } from "./constants.mjs";
import { WorkerContext } from "./context.mjs";
import { useInterval, useStyle } from "./hooks.mjs";
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
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [renderInfo, setRenderInfo] = useState();

  const worker = useContext(WorkerContext);
  useEffect(() => {
    const subId = worker.subscribe(setRenderInfo);
    return () => worker.unsubscribe(subId);
  }, []);

  const setAndSendStep = event => {
    if (playing) {
      setPlaying(false);
    }

    const nextStep = parseInt(event.target.value, 10);
    worker.setStep(nextStep);
    setStep(nextStep);
  };

  useInterval(
    () => {
      const nextStep = step + 1;
      if (nextStep < renderInfo.stepCount) {
        worker.setStep(nextStep);
        setStep(nextStep);
      } else {
        setPlaying(false);
      }
    },
    playing ? 20 : null
  );

  if (!renderInfo || renderInfo.stepCount <= 1) {
    return null;
  } else {
    return h(
      Fragment,
      {},
      h(
        "button",
        {
          className: classes.control,
          onClick: () => setPlaying(!playing)
        },
        h(playing ? icons.Pause : icons.Play, { size: 23 })
      ),
      h("input", {
        className: classes.slider,
        type: "range",
        min: 0,
        max: renderInfo.stepCount - 1,
        value: step,
        onChange: setAndSendStep
      })
    );
  }
};
