![Grimoire.js](./.github/logo.png)

[![Slack Status](https://grimoire-slackin.herokuapp.com/badge.svg)](https://grimoire-slackin.herokuapp.com/)
[![Circle CI](https://circleci.com/gh/GrimoireGL/GrimoireJS.svg?style=svg)](https://circleci.com/gh/GrimoireGL/GrimoireJS)
[![LICENSE](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/jThreeJS/jThree/blob/develop/LICENSE)
[![Dependency Status](https://david-dm.org/GrimoireGL/GrimoireJS.svg)](https://david-dm.org/GrimoireGL/GrimoireJS)
[![devDependency Status](https://david-dm.org/GrimoireGL/GrimoireJS/dev-status.svg)](https://david-dm.org/GrimoireGL/GrimoireJS#info=devDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/GrimoireGL/GrimoireJS.svg)](https://greenkeeper.io/)

## Overview

**Grimoire.js provide a bridge between Web engineers and CG engineers**

There were big gap between the development flows used for each.

Web engineers have typically used `event driven` javascript programs for daily works. And they mutate DOM APIs to make Web pages dynamic.

However, CG engineers has typically used `loop based` programs for daily works. These are mostly build with a programming language with strong type like C++ or C#.  And recently CG engineers more like to use strongly structured engines like Unity.

This is why these 2 engineers have so much different flow for workings. This is why it is hard to learn CG stuff by Web engineers. And CG engineers are also hard to make suitable APIs for Web engineers working with.

**Grimoire.js is a javascript(Typescript) framework to solve this problem with strong architecture**

## Features

You can see several feature of Grimoire.js providing in this section.  

**We strongly recommend to see our [top page](http://grimoire.gl) to learn these features. Most of written things are same as this README.md. But our samples on the top pages are working!!.**

### HTML like markup

We provides a syntax like XML to compose WebGL canvas. This is kind of HTML for Web engineers.
You can create 360 degree image viewer on browser only by writing the code below.(See official page to see working example)

```xml
<goml>
  <scene>
    <camera></camera>
    <mesh geometry="sphere" cull="front" texture="360.jpg">
      <mesh.components>
        <Rotate speed="0.1" />
      </mesh.components>
    </mesh>
  </scene>
</goml>
```

### DOM operation API

Web engineers typically write javascript to mutate DOM structures or attributes. All that kinds things are same at Grimoire. Web engineers can use query-based operation API to changing attributes, modifying structures of DOM or registering event handlers.

These are codes to co-work WebGL canvas and Web UIs that made with ordinal web development way. (You can see working example on our official top page)

```xml
<goml>
  <scene>
    <camera></camera>
    <mesh texture="logo.png" geometry="cube">
      <mesh.components>
        <Rotate speed="0,0.1,0" />
      </mesh.components>
    </mesh>
  </scene>
</goml>
```

```js
gr(function() {
  var mesh = gr('#simple .canvas')('mesh')
  $('#simple .red').on('click', function () {
    mesh.setAttribute('color', 'red')
  })
  $('#simple .blue').on('click', function () {
    mesh.setAttribute('color', 'blue')
  })
  mesh.on('mouseenter', function () {
    mesh.setAttribute('scale', '2.0')
    $("#simple .bigger").addClass("bold-label");
    $("#simple .smaller").removeClass("bold-label");
  })
  mesh.on('mouseleave', function () {
    mesh.setAttribute('scale', '1.0')
    $("#simple .smaller").addClass("bold-label");
    $("#simple .bigger").removeClass("bold-label");
  })
})
```

### Simple and powerful architecture, Typescript ready

If you really want to make WebGL stuff on your page, it is hard to make only by Web engineers if that contents requires highly customized representation. In this situation, Web engineers and CG engineers need to co-work.

CG engineers can write a component. And these are reusable.

And these are able to be written by Typescript. Safe and effective environment for development.

This is a sample to make objects waving movement. (You can see full comprehensive this sample at our top page)

```ts
import Component from "grimoirejs/ref/Node/Component";
import ISceneUpdateArgument from "grimoirejs-fundamental/ref/SceneRenderer/ISceneUpdateArgument";
import TransformComponent from "grimoirejs-fundamental/ref/Components/TransformComponent";
import Vector3 from "grimoirejs-math/ref/Vector3";
import gr from "grimoirejs";
class Wave extends Component{
  public static attributes = {
    amp:{
      default:1.0,
      converter:"Number"
    },
    speed:{
      default:1.0,
      converter:"Number"
    }
  };

  public amp:number;

  public speed:number;

  private transform: TransformComponent;

  public $mount():void{
    this.transform = this.node.getComponent(TransformComponent);
    this.__bindAttributes(); // bind component attributes to fields
  }
  public $update(t:ISceneUpdateArgument):void{
    this.transfrom.position = new Vector3(this.transform.position.X,Math.sin(this.speed * t.timer.timeInSecound) * this.amp,this.transform.position.Z);
  }
}
gr.registerComponent("Wave",Wave);
```

## Download

Please see official site and [Download page](https://grimoire.gl/guide/1_essentials/01_installation.html).

## Useful Links

* **Official Site**・・・http://grimoire.gl

### API Reference

See [here](https://api.grimoire.gl/core).

This document is automatically generated. 

<!--DOCUMENT STAMP-->

Make sure the API reference is only containing core stuff(Mutating goml stuff, operating attributes, methods being available on Component instance and so on).

If you want to see WebGL related feature of API, you should see [renderer plugin page](https://api.grimoire.gl/grimoirejs-fundamental).

## LICENSE

**MIT License**

(See the LICENSE file for more detail.)
