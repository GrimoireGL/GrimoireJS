import CanvasManager = require("../../Core/CanvasManager");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import JThreeContext = require("../../Core/JThreeContext");
import Scene = require("../../Core/Scene");
import $ = require("jquery");
class GomlTreeRdrNode extends GomlTreeNodeBase
{
    canvasManager:CanvasManager;

    constructor(elem:Element) {
        super(elem);
        var test = $(elem);
        console.log("css test:"+$(test).css("clearcolor"));
        var targetCanvas = $("<canvas></canvas>");
        targetCanvas.addClass("x-j3-c-" + this.ID);
        $(this.Frame).append(targetCanvas);
        this.canvasManager = CanvasManager.fromCanvas(<HTMLCanvasElement>targetCanvas[0]);
        var scene = new Scene();
        scene.addRenderer(this.canvasManager.getDefaultViewport());
        JThreeContext.Instance.SceneManager.addScene(scene);
    }

    get Frame(): string {
        return this.element.getAttribute("frame")||"body";
    }

}

export=GomlTreeRdrNode;
