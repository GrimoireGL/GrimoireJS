import CanvasManager = require("../../../Core/CanvasManager");
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import JThreeContext = require("../../../Core/JThreeContext");
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");
import Scene = require("../../../Core/Scene");
import GomlLoader = require("../../GomlLoader");
import Color4 = require("../../../Base/Color/Color4");
class RendererNode extends GomlTreeNodeBase
{
    canvasManager:CanvasManager;

    targetCanvas:HTMLCanvasElement;

    constructor(elem:HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase) {
        super(elem,loader,parent);
        //generate canvas
        var selected=document.querySelector(this.Frame);
        this.targetCanvas=document.createElement("canvas");
        if(selected)selected.appendChild(this.targetCanvas);
        else
          document.getElementsByTagName("body").item(0).appendChild(this.targetCanvas);
        this.targetCanvas.classList.add("x-j3-c-" + this.ID);
        //initialize contexts
        this.canvasManager = CanvasManager.fromCanvasElement(this.targetCanvas);
        var context=JThreeContextProxy.getJThreeContext();
        context.addCanvasManager(this.canvasManager);
        var defaultWidth=this.targetCanvas.parentElement.clientWidth;
        var defaultHeight=this.targetCanvas.parentElement.clientWidth;
        this.attributes.defineAttribute({
          "width":{
            value:defaultWidth,converter:"number",handler:(v)=>{this.targetCanvas.width=v.Value;}
          },
          "height":{
            value:defaultHeight,converter:"number",handler:(v)=>{this.targetCanvas.height=v.Value;}
          },
          "clearColor":{
            value:'#0FF',converter:"color4",handler:(v)=>{this.canvasManager.ClearColor=v.Value;}
                     },
          "fullscreen":
          {
              value:false,converter:"boolean",handler:(v)=>{
                  this.canvasManager.FullScreen=v.Value;
              }
          }
        });
        this.attributes.applyDefaultValue();
    }

    get Frame(): string {
        return this.element.getAttribute("frame")||"body";
    }

}

export=RendererNode;
