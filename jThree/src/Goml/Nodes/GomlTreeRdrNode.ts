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
        var targetCanvas = $("<canvas></canvas>");
        targetCanvas.addClass("x-j3-c-" + this.ID);
        $(this.Frame).append(targetCanvas);
        this.canvasManager = CanvasManager.fromCanvas(<HTMLCanvasElement>targetCanvas[0]);
        console.log(targetCanvas);
        console.log(this.canvasManager);
        var scene = new Scene();
        scene.addRenderer(this.canvasManager.getDefaultViewport());
        JThreeContext.getInstance().SceneManager.addScene(scene);
        console.log("Complete Rdr node");
    }

    get Frame(): string {
        return this.element.getAttribute("frame")||"body";
    }

}

export=GomlTreeRdrNode;
