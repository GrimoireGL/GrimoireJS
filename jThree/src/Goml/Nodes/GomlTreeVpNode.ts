import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import Color4 = require("../../Base/Color/Color4");
import ViewportRenderer = require("../../Core/ViewportRenderer");
import GomlTreeRdrNode = require("./GomlTreeRdrNode");
import Rectangle = require("../../Math/Rectangle");
import GomlLoader = require("../GomlLoader");
import JThreeContextProxy = require("../../Core/JThreeContextProxy");
import JThreeContext = require("../../Core/JThreeContext");
import Scene = require("../../Core/Scene");

class GomlTreeVpNode extends GomlTreeNodeBase {
    constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase)
    {
        super(elem,loader,parent);
        console.log(this.ClearColor);
        var rdr:GomlTreeRdrNode=<GomlTreeRdrNode>this.parent;
        var vp:ViewportRenderer=new ViewportRenderer(rdr.canvasManager,new Rectangle(this.Left,this.Top,50,50));
        var context:JThreeContext=JThreeContextProxy.getJThreeContext();
        var scene:Scene=new Scene();
        scene.addRenderer(vp);
        context.SceneManager.addScene(scene);
        vp.backgroundColor=this.ClearColor;
    }

    private clearColor:Color4;
    get ClearColor():Color4
    {
      this.clearColor=this.clearColor||Color4.parseColor(this.element.getAttribute('clearColor')||'#0FF');
      return this.clearColor;
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


}

export=GomlTreeVpNode;
