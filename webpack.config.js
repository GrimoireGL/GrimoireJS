const path = require("path");
const webpack = require("webpack");
const shell = require("webpack-shell-plugin");
const argv = require("yargs").argv;
const fs = require("fs");
const fnPrefix = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8")).name;

const getBuildTask = (fileName, plugins) => {
  return {
    cache: true,
    entry: path.resolve(__dirname, "src/index.ts"),
    output: {
      path: __dirname,
      filename: "/register/" + fileName,
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
    plugins: [new shell({
      onBuildStart: "npm run generate-expose",
      onBuildEnd: "npm run generate-reference"
    })].concat(plugins),
    devtool: 'source-map'
  }
};
const buildTasks = [getBuildTask(fnPrefix + ".js", [])]

if (argv.prod) {
  buildTasks.push(getBuildTask("index.js", [])); // for npm registeirng
  buildTasks.push(getBuildTask(fnPrefix + ".min.js", [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin()
  ]));
}

module.exports = buildTasks;
