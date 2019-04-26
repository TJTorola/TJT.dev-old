import { SCHEME as SC } from "./constants.mjs";
import { withClasses, withRoute } from "./hocs.mjs";
import { Component, h } from "./preact.mjs";

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

export const App = withRoute(
  withClasses(STYLE, ({ classes, route }) =>
    h("main", { class: classes.main }, [
      h("div", { class: classes.title }, [h("h1", {}, "A maze")]),
      h("header", { class: classes.header }, [
        h("input", {
          class: classes.slider,
          type: "range",
          min: 1,
          max: 100,
          value: 50
        })
      ]),
      h("nav", { class: classes.nav }, [
        h("h2", {}, "Generators"),
        h("hr"),
        h("ul", { class: classes.links }, [
          h(LiAnchor, { href: "#dfs" }, "Depth First Search"),
          h(LiAnchor, { href: "#kruskals" }, "Kruskal's Algorithm"),
          h(LiAnchor, { href: "#prims" }, "Prim's Algorithm"),
          h(LiAnchor, { href: "#recur-backtracker" }, "Recursive Backtracker"),
          h(LiAnchor, { href: "#recur-division" }, "Recursive Division"),
          h(LiAnchor, { href: "#wilsons" }, "Wilson's Algorithm")
        ]),
        h("h2", { style: { marginTop: SC.SPACING.L } }, "Solvers"),
        h("hr"),
        h("ul", { class: classes.links }, [
          h(LiAnchor, { href: "./a-star" }, "A* Algorithm"),
          h(LiAnchor, { href: "#${route}/bfs" }, "Breadth First Search"),
          h(LiAnchor, { href: "#${route}/dead-end" }, "Dead End Filling"),
          h(LiAnchor, { href: "#${route}/random" }, "Random Mouse"),
          h(LiAnchor, { href: "#${route}/tremauxs" }, "Trémaux's Algorithm"),
          h(LiAnchor, { href: "#${route}/wall-follow" }, "Wall Follower")
        ])
      ]),
      h("section", { class: classes.section })
    ])
  )
);
