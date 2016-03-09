# jThree
[![Slack Status](https://jthree-slackin.herokuapp.com/badge.svg)](https://jthree-slackin.herokuapp.com/)
[![Circle CI](https://circleci.com/gh/jThreeJS/jThree.svg?style=svg)](https://circleci.com/gh/jThreeJS/jThree)
[![LICENSE](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jThreeJS/jThree/blob/develop/LICENSE)
[![Dependency Status](https://david-dm.org/jThreeJS/jThree.svg)](https://david-dm.org/jThreeJS/jThree)
[![devDependency Status](https://david-dm.org/jThreeJS/jThree/dev-status.svg)](https://david-dm.org/jThreeJS/jThree#info=devDependencies)

**CI system has been moved to CircleCI from travisCI.**

**travisCI build log is available here https://travis-ci.org/jThreeJS/jThree for a while**

## What is jThree?

jThree is an innovative 3D graphics engine. It may seem to be just a javascript library.
However, jThree will enable browser to use most of the feature as other game engines do in local environment, plugins features,hierarchies,templates,module systems.


### Purposes

* Provide a good learning resource for the beginners to know how programming is awesome via this library.
* Sharing features that will be achieved easily by this library implemented with javascript.
* Redefine legacies of 3DCG technologies on the Internet.
* Have Enjoyable contributions :heart:


### Dependencies

This library depends on the following libraries. We appreciate these contributors below :heart:

|Name|Purpose|URL|Memo|
|:-:|:-:|:-:|:-:|
|gl-matrix|Use for calculation for webgl|https://github.com/toji/gl-matrix||


## Contributions

Thank you for your interest in contributions!   :kissing_smiling_eyes:


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
