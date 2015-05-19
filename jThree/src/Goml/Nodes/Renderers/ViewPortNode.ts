import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Color4 = require("../../../Base/Color/Color4");
import ViewportRenderer = require("../../../Core/ViewportRenderer");
import RendererNode = require("./RendererNode");
import Rectangle = require("../../../Math/Rectangle");
import GomlLoader = require("../../GomlLoader");
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");
import JThreeContext = require("../../../Core/JThreeContext");
import Scene = require("../../../Core/Scene");
import SceneObjectNodeBase = require("../SceneObjects/SceneObjectNodeBase");
import CameraNodeBase = require("../SceneObjects/Cameras/CameraNodeBase");
class GomlTreeVpNode extends GomlTreeNodeBase {

  private parentRendererNode:RendererNode;

  private targetRenderer:ViewportRenderer;

    constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase)
    {
        super(elem,loader,parent);
    }

    afterLoad(){
      var rdr:RendererNode=this.parentRendererNode=<RendererNode>this.parent;
      this.targetRenderer=new ViewportRenderer(rdr.canvasManager,new Rectangle(this.Left,this.Top,this.Width,this.Height));
      var context:JThreeContext=JThreeContextProxy.getJThreeContext();
      var cameraNode=this.resolveCamera();
      this.targetRenderer.Camera=cameraNode.TargetCamera;
      var scene:Scene=cameraNode.ContainedSceneNode.targetScene;
      scene.addRenderer(this.targetRenderer);
    }

    private resolveCamera():CameraNodeBase
    {
      var camTags=this.loader.nodeDictionary.getAliasMap<SceneObjectNodeBase>("jthree.camera");
      if(!camTags.has(this.Cam))//if there was no specified camera
      {
        console.error("can not find camera");
        if(camTags.size==0)
        {
          console.error("There is no scene.");
        }else
        {

        }
        return null;
      }
      var targetCam=<CameraNodeBase>camTags.get(this.Cam);
      if(targetCam.ContainedSceneNode!=null)//if there was specified camera and there is Scene
      {
        return targetCam;
      }else
      {
        console.error("cant retrieve scene!");
      }
    }
    private cam:string;
    private left:number;
    private top:number;
    private width:number;
    private height:number;

    get Cam():string
    {
      this.cam=this.cam||this.element.getAttribute('cam');
      return this.cam;
    }

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
