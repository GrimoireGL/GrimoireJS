const path = require("path");
const webpack = require("webpack");
const fs = require("fs");

// Shot package name will be used for prefix of filename
const fnPrefix = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8")).name.replace("grimoirejs", "grimoire");

// Copy task for optimization
class CopyPlugin {
  constructor(copyFrom, copyTo) {
    this.copyFrom = copyFrom;
    this.copyTo = copyTo;
  }
  apply(compiler) {
    compiler.plugin("after-emit", (compiler, callback) => {
      fs.createReadStream(this.copyFrom).pipe(fs.createWriteStream(this.copyTo));
      callback();
    });
  }
}

// Couldron generate-expose and generate-reference execute with build tasks.
class CauldronPlugin {
  apply(compiler) {
    compiler.plugin("compile", () => {
      try {
        console.log(require('child_process').execSync('npm run generate-expose').toString());
      } catch (e) {
        console.log(e);
      }
    });
    compiler.plugin('after-emit', (compiler, callback) => {
      try {
        console.log(require('child_process').execSync('npm run generate-reference').toString());
      } catch (e) {
        console.log(e);
      } finally {
        callback();
      }
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

module.exports = (env = {}) => {
  // This line might need to be modified for each plugin build environment.
  // If the plugin containing grimoirejs directly(calling require("grimoirejs/register")),
  // browser build and production build should contain babel-polyfill.
  // Make sure this is not require("grimoirejs")
  let includeCore = true;
  //
  //
  //
  if(!env.browser && !env.npm && !env.prod){
    env.browser = true;
  }
  const productPlugins = [new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),new webpack.optimize.OccurrenceOrderPlugin(),new webpack.optimize.AggressiveMergingPlugin()];
  let buildTasks = [];
  let skipIndex = false;
  let cauldron = new CauldronPlugin();
  if (env.browser || env.prod) {
    const plugins = [];
    // if needs index also and it was not including core, index.js must be copied from fnPrefix.js
    // since these are completely same build task. Yeah, optimization.
    if (!includeCore && (env.prod || env.npm)) {
      plugins.push(new CopyPlugin(`./register/${fnPrefix}.js`, './register/index.js'));
      plugins.push(new CopyPlugin(`./register/${fnPrefix}.js.map`, './register/index.js.map'));
      skipIndex = true;
      console.log(`${index}.js will be generated for NPM environment by copy`);      
    }
    buildTasks.push(getBuildTask(`${fnPrefix}.js`, [cauldron,...plugins], includeCore));
    console.log(`${fnPrefix}.js will be generated for browser environment`);
  }
  if (!skipIndex && (env.npm || env.prod)) {
    buildTasks.push(getBuildTask("index.js", [cauldron], false));
    console.log(`index.js will be generated for NPM environment`);          
  }
  if (env.prod) {
    buildTasks.push(getBuildTask(fnPrefix + ".min.js", [cauldron,...productPlugins],includeCore));
    console.log(`${fnPrefix}.min.js will be generated for browser environment`);          
  }
  return buildTasks;
};
