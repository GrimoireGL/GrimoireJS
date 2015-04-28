import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import Color4 = require("../../Base/Color/Color4");
import ViewportRenderer = require("../../Core/ViewportRenderer");
import GomlTreeRdrNode = require("./GomlTreeRdrNode");
import Rectangle = require("../../Math/Rectangle");
import GomlLoader = require("../GomlLoader");
import JThreeContextProxy = require("../../Core/JThreeContextProxy");
import Triangle = require("../../Shapes/Triangle");
import JThreeContext = require("../../Core/JThreeContext");
import Scene = require("../../Core/Scene");

class GomlTreeVpNode extends GomlTreeNodeBase {

  private parentRendererNode:GomlTreeRdrNode;

    constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase)
    {
        super(elem,loader,parent);
        var rdr:GomlTreeRdrNode=this.parentRendererNode=<GomlTreeRdrNode>this.parent;
        var vp:ViewportRenderer=new ViewportRenderer(rdr.canvasManager,new Rectangle(this.Left,this.Top,this.Width,this.Height));
        var context:JThreeContext=JThreeContextProxy.getJThreeContext();
        var scene:Scene=new Scene();
        scene.addObject(new Triangle());
        scene.addRenderer(vp);
        context.SceneManager.addScene(scene);
    }
    private left:number;
    private top:number;
    private width:number;
    private height:number;

    get Left():number{
      this.left=this.left||parseInt(this.element.getAttribute('left'))||0;
      return this.left;
    }

    get Top():number{
      this.top=this.top||parseInt(this.element.getAttribute('top'))||0;
      return this.top;
    }

    get Width():number
    {
      this.width=this.width||parseInt(this.element.getAttribute('width'))||this.parentRendererNode.Width||300;
      return this.width;
    }

    get Height():number
    {
      this.height=this.height||parseInt(this.element.getAttribute('height'))||this.parentRendererNode.Height||300;
      return this.height;
    }

}

export=GomlTreeVpNode;
