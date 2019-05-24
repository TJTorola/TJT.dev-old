import { SCHEME as SC } from "./constants.mjs";
import { Controls } from "./controls.mjs";
import { useLocation, useStyle, getHashRoute } from "./hooks.mjs";
import { Maze } from "./maze.mjs";
import { h } from "./react.mjs";

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
  background: black;
}

~content {
  align-items: center;
  background: ${SC.COLORS.GRAY.L};
  display: flex;
  flex-grow: 1;
  justify-content: center;
  position: relative;
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
  grid-template-columns: ${SC.SPACING.NAV_WIDTH}px auto;
  grid-template-rows: ${SC.SPACING.CONTROL_HEIGHT}px auto;
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

~title {
  align-items: center;
  border-bottom: solid ${SC.COLORS.GRAY.M} 1px;
  border-right: solid ${SC.COLORS.GRAY.M} 1px;
  display: flex;
  grid-area: 1 / 1;
  justify-content: center;
  margin: 0;
}`;

const LiAnchor = ({ children, href }) =>
  h("li", {}, h("a", { href }, children));

export const App = () => {
  const loc = useLocation();
  const classes = useStyle(STYLE);

  return h(
    "main",
    { className: classes.main },
    h("div", { className: classes.title }, h("h1", {}, "A Maze")),
    h(
      "header",
      { className: classes.header },
      h(Controls)
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
          { href: getHashRoute({ generator: "hilburt" }) },
          "Hilburt's Curve"
        ),
        h(LiAnchor, { href: getHashRoute({ generator: "random" }) }, "Random"),
        h(LiAnchor, { href: getHashRoute({ generator: "test" }) }, "Test")
      )
    ),
    h("section", { className: classes.content }, h(Maze))
  );
};
