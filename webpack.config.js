const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    "core-shell": "./static/ts/core-shell.ts",
    eventBus: "./static/ts/eventBus.ts",
    hero3d: "./static/ts/hero3d.ts",
    "wasm-terminal": "./static/ts/wasm-terminal.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "static/js"),
  },
};
