const path = require("path");
const shell = require("webpack-shell-plugin");
module.exports = {
    cache:true,
    entry: path.resolve(__dirname,"src/index.ts"),
    output: {
        path: __dirname + "/register",
        filename: "index.js",
        libraryTarget:"umd"
    },
    module: {
      loaders: [{
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: "babel-loader?presets[]=es2015,presets[]=stage-2,plugins[]=transform-runtime!ts-loader"
      }]
    },
    resolve: {
        extensions: ['','.ts','.js']
    },
    plugins:[
      new shell({
        onBuildStart:"npm run generate-expose",
        onBuildEnd:"npm run generate-reference"
      })
    ],
    devtool: 'source-map'
};
