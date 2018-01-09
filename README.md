<h1 align="center">Grimoire.js</h1>
<center><img src="./.github/symbol-logo.png" width="256" /></center>

<center><strong>A WebGL framework for building bridge between CG and Web engineers.</strong></center>

<center>
<a href="https://circleci.com/gh/GrimoireGL/GrimoireJS"><img src="https://circleci.com/gh/GrimoireGL/GrimoireJS.svg?style=svg"/></a>
<a href="https://github.com/GrimoireGL/GrimoireJS/blob/develop/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg"/></a>
<a href="https://david-dm.org/GrimoireGL/GrimoireJS.svg"><img src="https://david-dm.org/GrimoireGL/GrimoireJS.svg"/></a>
<a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/GrimoireGL/GrimoireJS.svg"/></a>
</center>

# Examples
<center>
<a href="http://sushi.grimoire.gl"><img src="https://i.gyazo.com/ec1045e07300351fa1f964e975f71369.gif"/></a>
<a href="http://jsdo.it/cx20/iKjH"><img height="174" src="https://i.gyazo.com/8dd870e0a2f94e89744f52f3063cdcd2.gif"/></a>
</center>

# Features

You can see several features of Grimoire.js providing in this section.  

**We strongly recommend seeing our [top page](http://grimoire.gl) to learn these features. Most of the written things are same as this README.md. But our samples on the top pages are working!!.**

## XML based markup

We provide a syntax like XML to compose WebGL canvas. This is kind of HTML for Web engineers.
You can create 360-degree image viewer on browser only by writing the code below.

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

## DOM operation API

Web engineers typically write javascript to mutate DOM structures or attributes. All that kinds things are same at Grimoire. Web engineers can use query-based operation API for changing attributes, modifying structures of DOM or registering event handlers.

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

## Simple and powerful architecture, Typescript ready

If you really want to make WebGL stuff on your page, it is hard to make only by Web engineers if those contents require highly customized representation. In this situation, Web engineers and CG engineers need to co-work.

CG engineers can write a component. And these are reusable.

And these are able to be written by Typescript. A safe and effective environment for development.

This is a sample to make objects waving movement. (You can see full comprehensive this sample on our top page)

```ts
import Component from "grimoirejs/ref/Core/Component";
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

Make sure the API reference is only containing core stuff(Mutating goml stuff, operating attributes, methods being available on the Component instance and so on).

If you want to see WebGL related feature of API, you should see [renderer plugin page](https://api.grimoire.gl/grimoirejs-fundamental).

## LICENSE

**MIT License**

(See the LICENSE file for more detail.)
