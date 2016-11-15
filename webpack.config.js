const path = require("path");
const webpack = require("webpack");
const shell = require("webpack-shell-plugin");
const argv = require("yargs").argv;

const plugins = [new shell({
  onBuildStart: "npm run generate-expose",
  onBuildEnd: "npm run generate-reference"
})];
let fileName = "/register/index.js";

if (argv.prod) {
  plugins.push(
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin());
  fileName = "/register/index.min.js";
}

module.exports = {
  cache: true,
  entry: path.resolve(__dirname, "src/index.ts"),
  output: {
    path: __dirname,
    filename: fileName,
    libraryTarget: "umd"
  },
  module: {
    loaders: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: "babel-loader?presets[]=es2015,presets[]=stage-2,plugins[]=transform-runtime!ts-loader"
    }]
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  plugins: plugins,
  devtool: 'source-map'
};
