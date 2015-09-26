# jThree
[![Build Status](https://travis-ci.org/jThreeJS/jThree.svg?branch=develop)](https://travis-ci.org/jThreeJS/jThree)


## What is jThree?

jThree is an innovative game engine. jThree may seem to be just only javascript library.
However, jThree enable browser to use most of feature the other game engine do in local envirnoment, plugin feature,hierarchy,template,module system.


### Puropse

* Provide good learning resource for the beginners to know how programming is awesome via this library.
* Easy shareing feature it will be achived because of this library being implemented in javascript.
* Redefine the legacy of 3DCG in Web.
* Keep  Enjoinable contribution :heart:


### Dependencies

This library depend on these below library, we appriciate these all of the contributors :heart:

|Name|Purpose|URL|Memo|
|:-:|:-:|:-:|:-:|
|superagent|Use for ajax to resolve plugins|https://visionmedia.github.io/superagent/||
|gl-matrix|Use for calculation for webgl|https://github.com/toji/gl-matrix||


## Contribution

Thank you for interesting in contribution!   :kissing_smiling_eyes:


### Instalation for build

You need the applications below.
* node.js
* npm

You need **not** to install packages in global

you need to run the command below to install local npm packages,bower packages,and so on.

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

## Coding Style

Almost every code in this project is witten with Typescript.
For writing Typescript, we use these coding style below.
There is too much code in this project that is not forrowing this coding style, but It will follow these coding style in future by refactoring.
https://github.com/jThreeJS/jThree/edit/develop/README.md#


### Names

* Use PascalCase for type names.
* Do not use "I" as a prefix for interface names.
* Use PascalCase for enum values.
* Use camelCase for function names.
* Use camelCase for property names and local variables.
* Do not use "_" as a prefix for private properties.
* Use whole words in names when possible.


## Rendering algorithm

jThree is implemented by light pre-pass deffered renderer.
The rendering path is like this below. (This signature is drawed for the specific case there is no post effect)
![](https://lh6.googleusercontent.com/PHI6mM8ZfJmFtNuRbY9MBNpsaQ_2fXdbIVrJQnXDN85HvkIzyf48SNXKwmSX1Jo29m5CS1S27rrej6s=w2124-h1072-rw)
