const path = require("path");
const webpack = require("webpack");
const argv = require("yargs").argv;
const fs = require("fs");
const fnPrefix = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8")).name.replace("grimoirejs", "grimoire");

const getBuildTask = (fileName, plugins, needPolyfill) => {

  return {
    cache: true,
    entry: needPolyfill ? ['babel-polyfill', path.resolve(__dirname, "src/index.ts")] : path.resolve(__dirname, "src/index.ts"),
    output: {
      path: __dirname,
      filename: "/register/" + fileName,
      libraryTarget: "umd"
    },
    module: {
      loaders: [{
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "babel-loader?presets[]=es2015,presets[]=stage-2!ts-loader"
      }]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    plugins: plugins,
    devtool: 'source-map'
  }
};

module.exports = (env)=>{
  env = env || {};
  const buildTasks = [getBuildTask(fnPrefix + ".js", [], true)]

  if (env.prod) {
    buildTasks.push(getBuildTask("index.js", [], false)); // for npm registeirng
    buildTasks.push(getBuildTask(fnPrefix + ".min.js", [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ], true));
  }
  return buildTasks;
};
