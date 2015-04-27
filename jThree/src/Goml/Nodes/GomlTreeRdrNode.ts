import CanvasManager = require("../../Core/CanvasManager");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import JThreeContext = require("../../Core/JThreeContext");
import JThreeContextProxy = require("../../Core/JThreeContextProxy");
import Scene = require("../../Core/Scene");
import $ = require("jquery");
import GomlLoader = require("../GomlLoader");
class GomlTreeRdrNode extends GomlTreeNodeBase
{
    canvasManager:CanvasManager;

    constructor(elem:Element,loader:GomlLoader,parent:GomlTreeNodeBase) {
        super(elem,loader,parent);
        var test = $(elem);
        var targetCanvas = $("<canvas></canvas>");
        targetCanvas.addClass("x-j3-c-" + this.ID);
        $(this.Frame).append(targetCanvas);
        this.canvasManager = CanvasManager.fromCanvas(<HTMLCanvasElement>targetCanvas[0]);
    }

    get Frame(): string {
        return this.element.getAttribute("frame")||"body";
    }

}

export=GomlTreeRdrNode;
