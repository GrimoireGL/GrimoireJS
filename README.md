# GrimoireJS -- A service-oriented Web3D framework.
[![Slack Status](https://jthree-slackin.herokuapp.com/badge.svg)](https://jthree-slackin.herokuapp.com/)
[![Circle CI](https://circleci.com/gh/GrimoireGL/GrimoireJS.svg?style=svg)](https://circleci.com/gh/GrimoireGL/GrimoireJS)
[![Appveyor Status](https://ci.appveyor.com/api/projects/status/github/GrimoireGL/GrimoireJS?branch=develop&svg=true)](https://ci.appveyor.com/project/LimeStreem/jthree)

[![LICENSE](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jThreeJS/jThree/blob/develop/LICENSE)
[![Dependency Status](https://david-dm.org/GrimoireGL/GrimoireJS.svg)](https://david-dm.org/GrimoireGL/GrimoireJS)
[![devDependency Status](https://david-dm.org/GrimoireGL/GrimoireJS/dev-status.svg)](https://david-dm.org/GrimoireGL/GrimoireJS#info=devDependencies)

## About

### Mission

**Establish usage of 3DCG as assets over the web like text,image,video and so on.**

This is the one and only mission we define.

### Our methods

* Make every developer being able to focus in the most important task they want to do.
* Redefine the value of 3DCG over the web.
* Fully care about UX for contributors.
* This is not game engine, but **Web3D service engine**

### Dependencies

This library depends on the following libraries. We appreciate these contributors below :heart:

|Name|Purpose|URL|Memo|
|:-:|:-:|:-:|:-:|
|gl-matrix|Use for calculation for webgl|https://github.com/toji/gl-matrix||

### Installation to build

You need the applications below.
* node.js
* npm

You need **not** to install any packages in global.

You need to run the command below to install npm packages,bower packages,and so on in local environment.

```shell
npm install
```

**That is all you need to do for preparation!**

Then, run the command below to build "j3.js"

```shell
npm run build
```

|command|description|
|:-:|:-:|
|npm run build|build "j3.js"|
|npm run test|run test|
|npm run watch|watch files for build and run simple web server(under wwwroot)|
|npm start|only run simple web server(under wwwroot)|

(simple web server supported LiveReload)
