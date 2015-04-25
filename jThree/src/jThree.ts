import JThreeContext = require('./Core/JThreeContext');
import $=require('jquery');
import col4 = require("./Base/Color/Color4");
var noInit: boolean;
if (!String.prototype["format"]) {
    String.prototype["format"] = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, num) {
            if (typeof args[num] != 'undefined') {
                return args[num];
            } else {
                return match;
            }
        });
    };
}
  $(() => {
    if (noInit)return;
    console.log(col4.parseColor('rgb(255,255,128)').toString());
    //var j3:JThreeContext=JThreeContext.Instance;
    //j3.GomlLoader.initForPage();

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
