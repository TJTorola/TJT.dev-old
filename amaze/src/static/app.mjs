import { SCHEME as SC } from "./constants.mjs";
import { useLocation, useStyle, useMaze, getHashRoute } from "./hooks.mjs";
import * as icons from "./icons.mjs";
import { Maze } from "./maze.mjs";
import { Component, h, useState } from "./react.mjs";
import { clamp, m } from "./lib/util.mjs";

const STYLE = `
hr {
  border-color: ${SC.COLORS.GRAY.M};
  border-top: 0;
  border-width: 1px;
}

button {
  background: inherit;
  border: 0;
  cursor: pointer;
  padding: 0;
}

canvas {
  border: ${SC.SPACING.XS} solid black;
}

~content {
  align-items: center;
  background: ${SC.COLORS.GRAY.L};
  display: flex;
  flex-grow: 1;
  justify-content: center;
}

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

~slider {
  width: 100%;
}

~subheader {
  margin-bottom: ${SC.SPACING.XS};
}

~title {
  align-items: center;
  border-bottom: solid ${SC.COLORS.GRAY.M} 1px;
  border-right: solid ${SC.COLORS.GRAY.M} 1px;
  display: flex;
  grid-area: 1 / 1;
  justify-content: center;
  margin: 0;
}`;

export const LiAnchor = ({ children, href }) =>
  h("li", {}, h("a", { href }, children));

export const App = () => {
  const loc = useLocation();
  const classes = useStyle(STYLE);
  const maze = useMaze({ cellSize: 10, maxWidth: 600, maxHeight: 300 });

  return h(
    "main",
    { className: classes.main },
    h("div", { className: classes.title }, h("h1", {}, "A maze")),
    h(
      "header",
      { className: classes.header },
      h("button", { className: classes.control }, h(icons.Play, { size: 23 })),
      h("input", {
        className: classes.slider,
        type: "range",
        min: 0,
        max: 100,
        value: maze.step,
        onChange: e => {
          const nextStep = clamp(0, 100)(e.target.value);
          if (maze.step !== nextStep) {
            maze.setStep(nextStep);
          }
        }
      })
    ),
    h(
      "nav",
      { className: classes.nav },
      h("h2", { className: classes.subheader }, "Generators"),
      h("hr"),
      h(
        "ul",
        { className: classes.links },
        h(
          LiAnchor,
          { href: getHashRoute({ generator: "dfs" }) },
          "Depth First Search"
        ),
        h(
          LiAnchor,
          { href: getHashRoute({ generator: "kruskals" }) },
          "Kruskal's Algorithm"
        ),
        h(
          LiAnchor,
          { href: getHashRoute({ generator: "prims" }) },
          "Prim's Algorithm"
        ),
        h(
          LiAnchor,
          { href: getHashRoute({ generator: "recur-backtracker" }) },
          "Recursive Backtracker"
        ),
        h(
          LiAnchor,
          { href: getHashRoute({ generator: "recur-division" }) },
          "Recursive Division"
        ),
        h(
          LiAnchor,
          { href: getHashRoute({ generator: "wilsons" }) },
          "Wilson's Algorithm"
        )
      ),
      h("h2", { className: classes.subheader }, "Solvers"),
      h("hr"),
      h(
        "ul",
        { className: classes.links },
        h(LiAnchor, { href: getHashRoute({ solver: "a-star" }) }, "A* Algorithm"),
        h(
          LiAnchor,
          { href: getHashRoute({ ...loc.params, solver: "bfs" }) },
          "Breadth First Search"
        ),
        h(
          LiAnchor,
          { href: getHashRoute({ ...loc.params, solver: "dead-end" }) },
          "Dead End Filling"
        ),
        h(
          LiAnchor,
          { href: getHashRoute({ ...loc.params, solver: "random" }) },
          "Random Mouse"
        ),
        h(
          LiAnchor,
          { href: getHashRoute({ ...loc.params, solver: "tremauxs" }) },
          "Trémaux's Algorithm"
        ),
        h(
          LiAnchor,
          { href: getHashRoute({ ...loc.params, solver: "wall-follow" }) },
          "Wall Follower"
        )
      )
    ),
    h("section", { className: classes.content }, h(Maze, maze))
  );
};
