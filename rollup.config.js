import vue from "rollup-plugin-vue";
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import globals from "rollup-plugin-node-globals";
import buble from "rollup-plugin-buble";
import uglify from "rollup-plugin-uglify";
import css from "rollup-plugin-css-only";

const plugins = [
  nodeResolve({
    browser: true,
    jsnext: true,
    main: true,
    preferBuiltins: true
  }),
  commonjs(),
  globals(),
  vue({ css: "client/bundle.css" }),
  buble({ exclude: "node_modules/**" }),
  css({ output: "client/styles.css" })
];

if (process.env.NODE_ENV === "production") {
  plugins.push(uglify());
}

export default {
  input: "vue/app.js",
  plugins,
  context: "window",
  output: {
    file: "client/bundle.js",
    format: "iife",
    sourcemap: true
  },
  watch: { exclude: "node_modules/**" }
};