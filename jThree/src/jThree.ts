import JThreeContext = require('./Core/JThreeContext');
import $=require('jquery');
var noInit: boolean;

  $(() => {
    if (noInit)return;
    alert('Hello World');
    //
    // var jThreeContext: JThreeContext = JThreeContext.Instance;
    // //var renderer = jThree.CanvasManager.fromCanvas(<HTMLCanvasElement>document.getElementById("test-canvas"));
    // //var renderer2 = jThree.CanvasManager.fromCanvas(<HTMLCanvasElement>document.getElementById("test-canvas2"));
    // //var scene = new jThree.Scene();
    // //scene.addRenderer(renderer.getDefaultViewport());
    // //scene.addRenderer(renderer2.getDefaultViewport());
    // //scene.addObject(new jThree.Triangle());
    // //jThreeContext.SceneManager.addScene(scene);
    // //buf = jThreeContext.ResourceManager.createBuffer("test-buffer", jThree.BufferTargetType.ArrayBuffer, jThree.BufferUsageType.DynamicDraw,3,jThree.ElementType.Float);
    // jThreeContext.init
    // console.log('Hello World');
    // //GOML テスト
    // jThreeContext.GomlLoader.initForPage();
});
