import CanvasManager = require("../../Core/CanvasManager");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import JThreeContext = require("../../Core/JThreeContext");
import JThreeContextProxy = require("../../Core/JThreeContextProxy");
import Scene = require("../../Core/Scene");
import $ = require("jquery");
import GomlLoader = require("../GomlLoader");
import Color4 = require("../../Base/Color/Color4");
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
        this.canvasManager.ClearColor=this.ClearColor;
    }

        private clearColor:Color4;
        get ClearColor():Color4
        {
          this.clearColor=this.clearColor||Color4.parseColor(this.element.getAttribute('clearColor')||'#0FF');
          return this.clearColor;
        }


    get Frame(): string {
        return this.element.getAttribute("frame")||"body";
    }

}

export=GomlTreeRdrNode;
