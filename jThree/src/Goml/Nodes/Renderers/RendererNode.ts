import CanvasManager = require("../../../Core/CanvasManager");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import JThreeContext = require("../../../Core/JThreeContext");
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");
import Scene = require("../../../Core/Scene");
import $ = require("jquery"); 
import GomlLoader = require("../../GomlLoader");
import Color4 = require("../../../Base/Color/Color4");
class GomlTreeRdrNode extends GomlTreeNodeBase
{

    canvasManager:CanvasManager;

    targetCanvas:HTMLCanvasElement;

    constructor(elem:HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase) {
        super(elem,loader,parent);
        var test = $(elem);
        var jqueryTargetCanvas = $("<canvas></canvas>");
        $(this.Frame).append(jqueryTargetCanvas);
        this.targetCanvas=<HTMLCanvasElement>jqueryTargetCanvas[0];
        this.targetCanvas.classList.add("x-j3-c-" + this.ID);
        this.canvasManager = CanvasManager.fromCanvasElement(this.targetCanvas);
        this.canvasManager.ClearColor=this.ClearColor;
        this.targetCanvas.width=this.Width;
        this.targetCanvas.height=this.Height;
        var context=JThreeContextProxy.getJThreeContext();
        context.addCanvasManager(this.canvasManager);
        this.attributes.defineAttribute({
          "width":{
            value:300,converter:"number",handler:(v)=>{this.targetCanvas.width=v.Value;}
          },
          "height":{
            value:300,converter:"number",handler:(v)=>{this.targetCanvas.height=v.Value;}
          },
          "clearColor":{
            value:'#0FF',converter:"color4",handler:(v)=>{this.canvasManager.ClearColor=v.Value;}
                     }
        });
    }

        private clearColor:Color4;
        get ClearColor():Color4
        {
          this.clearColor=this.clearColor||Color4.parseColor(this.element.getAttribute('clearColor')||'#0FF');
          return this.clearColor;
        }

        private width:number;
        get Width():number{
          this.width=this.width||parseInt(this.element.getAttribute('width'))||300;
          return this.width;
        }

        private height:number;
        get Height():number{
          this.height=this.height||parseInt(this.element.getAttribute('height'))||300;
          return this.height;
        }

    get Frame(): string {
        return this.element.getAttribute("frame")||"body";
    }

}

export=GomlTreeRdrNode;
