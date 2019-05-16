import { Grid } from "./canvas-grid.mjs";
import { SCHEME as SC } from "./constants.mjs";
import {
  compose,
  withCss,
  withClasses,
  withRoute,
  withState,
  withProps
} from "./hocs.mjs";
import { genRandomSteps } from "./maze-generators.mjs";
import { Component, h } from "./preact.mjs";
import { clamp, getHash, m } from "./util.mjs";

const STYLE = `
  hr {
    border-color: ${SC.COLORS.GRAY.M};
    border-top: 0;
    border-width: 1px;
  }

  ~header {
    align-items: center;
    border-bottom: solid ${SC.COLORS.GRAY.M} 1px;
    display: flex;
    flex-direction: row;
    grid-area: 1 / 2;
    justify-content: space-between;
    padding: 0 ${SC.SPACING.M};
  }

  ~links {
    padding-bottom: ${SC.SPACING.L};
    padding-top: ${SC.SPACING.S};
  }

  ~links li {
    margin-bottom: ${SC.SPACING.XS};
  }

  ~main {
    display: grid;
    font-family: Helvetica, Arial, sans-serif;
    grid-template-columns: ${SC.SPACING.NAV_WIDTH} auto;
    grid-template-rows: ${SC.SPACING.CONTROL_HEIGHT} auto;
    height: 100%;
    min-height: ${SC.SPACING.MIN_APP_HEIGHT};
    min-width: ${SC.SPACING.MIN_APP_WIDTH};
    width: 100%;
  }

  ~nav {
    border-right: solid ${SC.COLORS.GRAY.M} 1px;
    grid-area: 2 / 1;
    padding-left: ${SC.SPACING.M};
    padding-top: ${SC.SPACING.M};
  }

  ~section {
    grid-area: 2 / 2;
  }

  ~subheader {
    margin-bottom: ${SC.SPACING.XS};
  }

  ~slider {
    flex-grow: 1
  }

  ~title {
    align-items: center;
    border-bottom: solid ${SC.COLORS.GRAY.M} 1px;
    border-right: solid ${SC.COLORS.GRAY.M} 1px;
    display: flex;
    grid-area: 1 / 1;
    justify-content: center;
    margin: 0;
  }
`;

export const LiAnchor = ({ children, href }) =>
  h("li", {}, [h("a", { href }, children)]);

const genRandomMaze = m(() => {
  const meta = {
    cellSize: 20,
    wallSize: 3,
    maxHeight: 700,
    maxWidth: 400
  };

  return {
    maze: {
      steps: genRandomSteps(100, meta),
      meta
    }
  };
});

export const App = compose([
  withCss,
  withRoute,
  withClasses(STYLE),
  withState({ step: 0 }),
  withProps(() => genRandomMaze()),
])(({ classes, params, maze, state: { step }, setState }) =>
  h("main", { class: classes.main }, [
    h("div", { class: classes.title }, [h("h1", {}, "A maze")]),
    h("header", { class: classes.header }, [
      h("input", {
        class: classes.slider,
        type: "range",
        min: 0,
        max: maze.steps.length,
        value: step,
        onChange: e => {
          const nextStep = clamp(0, maze.steps.length)(e.target.value);
          if (step !== nextStep) {
            setState({ step: nextStep });
          }
        }
      })
    ]),
    h("nav", { class: classes.nav }, [
      h("h2", { class: classes.subheader }, "Generators"),
      h("hr"),
      h("ul", { class: classes.links }, [
        h(
          LiAnchor,
          { href: getHash({ generator: "dfs" }) },
          "Depth First Search"
        ),
        h(
          LiAnchor,
          { href: getHash({ generator: "kruskals" }) },
          "Kruskal's Algorithm"
        ),
        h(
          LiAnchor,
          { href: getHash({ generator: "prims" }) },
          "Prim's Algorithm"
        ),
        h(
          LiAnchor,
          { href: getHash({ generator: "recur-backtracker" }) },
          "Recursive Backtracker"
        ),
        h(
          LiAnchor,
          { href: getHash({ generator: "recur-division" }) },
          "Recursive Division"
        ),
        h(
          LiAnchor,
          { href: getHash({ generator: "wilsons" }) },
          "Wilson's Algorithm"
        )
      ]),
      h("h2", { class: classes.subheader }, "Solvers"),
      h("hr"),
      h("ul", { class: classes.links }, [
        h(LiAnchor, { href: getHash({ solver: "a-star" }) }, "A* Algorithm"),
        h(
          LiAnchor,
          { href: getHash({ ...params, solver: "bfs" }) },
          "Breadth First Search"
        ),
        h(
          LiAnchor,
          { href: getHash({ ...params, solver: "dead-end" }) },
          "Dead End Filling"
        ),
        h(
          LiAnchor,
          { href: getHash({ ...params, solver: "random" }) },
          "Random Mouse"
        ),
        h(
          LiAnchor,
          { href: getHash({ ...params, solver: "tremauxs" }) },
          "Trémaux's Algorithm"
        ),
        h(
          LiAnchor,
          { href: getHash({ ...params, solver: "wall-follow" }) },
          "Wall Follower"
        )
      ])
    ]),
    h("section", { class: classes.section }, [h(Grid, { step, ...maze })])
  ])
);
