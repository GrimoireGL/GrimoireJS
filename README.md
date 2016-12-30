![Grimoire.js](./.github/logo.png)

[![Slack Status](https://grimoire-slackin.herokuapp.com/badge.svg)](https://grimoire-slackin.herokuapp.com/)
[![Circle CI](https://circleci.com/gh/GrimoireGL/GrimoireJS.svg?style=svg)](https://circleci.com/gh/GrimoireGL/GrimoireJS)
[![LICENSE](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jThreeJS/jThree/blob/develop/LICENSE)
[![Dependency Status](https://david-dm.org/GrimoireGL/GrimoireJS.svg)](https://david-dm.org/GrimoireGL/GrimoireJS)
[![devDependency Status](https://david-dm.org/GrimoireGL/GrimoireJS/dev-status.svg)](https://david-dm.org/GrimoireGL/GrimoireJS#info=devDependencies)

## Overview

Why virtual DOM needs to be only for actual DOM?
Logics like drawing formulas for canvas even needs DOM for easier way.

* **DOM based** ・・・The way that Web engineers can work most effectively.
* **jQuery like API** ・・・No more complex procedural WebGL logics, just operate attributes with the API.
* **Web development friendly**・・・Use with the other Web front-end frameworks. Very easy to coop with them.
* **No more redundant codes**・・・Include only `tag`s you actually need.

## First Interact

**HTML file**

```xml
<html>
  <head>
    <script src="grimoire-preset-basic.js"></script>
  </head>
  <body>
    <script type="text/goml" src="./index.goml">
  </body>
</html>
```

**GOML file(Canvas DOM we defined)**

```xml
<goml>
  <scene>
    <camera>
      <camera.components>
        <!-- Attaching component to move the camera with mouse-->
        <MouseCameraControl/>
      </camera.components>
    </camera>
    <mesh geometry="cube" color="red"/>
  </scene>
</goml>
```

## Purpose

**WebGL is not only for games, but also for web services.**

After WebGL feature being implemented with modern browsers, many impressive Web3D libraries are appeared. However, most of them are just imported from 3D development culture that was grown in the environments very apart from web development culture.

There should be good way of mixing these cultures. Grimoire.js is one of solution of that future.

## Useful Links

* **Official Site**・・・http://grimoire.gl

(Currently all of documents are written in japanese only)

## Extensions

You can try these plugins with just downloading them. Or, If you are npm user, you can install them with `npm install` easily.

### Major Plugins

Plugin is a necessary feature to use Grimoire.js. Most of features are separated as plugin. This repo is core of Grimoire.js not containing any WebGL codes.

|Name|Purpose|Dependency|
|:-:|:-:|:-:|
|grimoirejs-math| Defining math related class and converters| None|
|grimoirejs-fundamental| Defining basement system for WebGL and defines basic tags|grimoirejs-math|
|grimoirejs-gltf|glTF model loader plugin defines the tags to populate glTF model in the scene|grimoirejs-math,grimoirejs-fundamental|

### Major Presets

It is hard work to download all depends plugins and links with script tag. So, there are presets containing multiple plugins.

* grimoirejs-preset-basic・・・containing grimoirejs,grimoirejs-fundamental,grimoirejs-math

## LICENSE

**MIT License**

(See the LICENSE file for more detail.)
