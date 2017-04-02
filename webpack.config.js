const path = require("path");
const webpack = require("webpack");
const argv = require("yargs").argv;
const fs = require("fs");
// Shot package name will be used for prefix of filename
const fnPrefix = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8")).name.replace("grimoirejs", "grimoire");

// Copy task for optimization
class CopyPlugin{
  constructor(copyFrom,copyTo){
    this.copyFrom = copyFrom;
    this.copyTo = copyTo;
  }
  apply(compiler){
    compiler.plugin("after-emit",(compiler,callback)=>{
      fs.createReadStream(this.copyFrom).pipe(fs.createWriteStream(this.copyTo));
      callback();
    });
  }
}

const getBuildTask = (fileName, plugins, needPolyfill) => {
  return {
    cache: true,
    entry: needPolyfill ? ['babel-polyfill', path.resolve(__dirname, "src/index.ts")] : path.resolve(__dirname, "src/index.ts"),
    output: {
      path: __dirname,
      filename: "./register/" + fileName,
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
  let includeCore = true;
  // if this package was preset including core or core package,
  // Script for browser needs babel-polyfill
  let polyfills = includeCore ? [true,false,true] : [false,false,false];
  env = env || {};
  let buildTasks = [];
  let isDefault = !env.browser && !env.npm && !env.prod;
  let skipIndex = false;
  if(env.browser || env.prod){
    const plugins = [];
    // if needs index also and it was not including core, index.js must be copied from fnPrefix.js
    // since these are completely same build task. Yeah, optimization.
    if(!includeCore && (env.prod || env.npm)){
      plugins.push(new CopyPlugin(`./register/${fnPrefix}.js`,'./register/index.js'));
      plugins.push(new CopyPlugin(`./register/${fnPrefix}.js.map`,'./register/index.js.map'));
      skipIndex = true;
    }
    buildTasks.push(getBuildTask(`${fnPrefix}.js`, plugins,polyfills[0]));
  }
  if(!skipIndex && (isDefault || env.npm || env.prod)){
    buildTasks.push(getBuildTask("index.js", [],polyfills[1]));
  }
  if (env.prod) {
    buildTasks.push(getBuildTask(fnPrefix + ".min.js", [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.AggressiveMergingPlugin()
    ],polyfills[2]));
  }
  return buildTasks;
};
