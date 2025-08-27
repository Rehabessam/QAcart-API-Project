import path from "path";
import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

const customResolver = resolve({
	extensions: [".js"]
});

export default {
	input: "src/index.js",
	external: Object.keys(pkg.peerDependencies),
	output: [{
    file: path.join(pkg.output, "index.cjs.js"),
    format: "cjs"
  }, {
    file: path.join(pkg.output, "index.esm.js"),
    format: "esm"
  }],
	plugins: [
		alias({
			entries: [{
        find: new RegExp("utilities", "gi"),
        replacement: path.resolve(__dirname, "src/utilities"),
      }, {
        find: new RegExp("features", "gi"),
        replacement: path.resolve(__dirname, "src/features"),
      }, {
        find: "server",
        replacement: path.resolve(__dirname, "src/server"),
      }],
			customResolver
		}),
		customResolver,
		babel({
			babelHelpers: "runtime",
			exclude: "node_modules/**",
			presets: ["@babel/preset-env"]
		}),
		commonjs(),
		terser()
	]
};
