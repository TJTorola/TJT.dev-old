import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "main.ts",
  output: {
    dir: ".",
    sourcemap: "inline",
    sourcemapExcludeSources: process.env.BUILD === "production",
    format: "cjs",
    exports: "default",
    banner,
  },
  external: ["obsidian"],
  plugins: [typescript(), nodeResolve({ browser: true }), commonjs()],
};

