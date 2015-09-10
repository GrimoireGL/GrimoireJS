import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import RendererBase = require("../../../Core/Renderers/RendererBase");
import RendererNodeBase = require("./RendererNodeBase");
import Rectangle = require("../../../Math/Rectangle");
import GomlLoader = require("../../GomlLoader");
import JThreeContextProxy = require("../../../Core/JThreeContextProxy");
import JThreeContext = require("../../../Core/JThreeContext");
import Scene = require("../../../Core/Scene");
import SceneObjectNodeBase = require("../SceneObjects/SceneObjectNodeBase");
import CameraNodeBase = require("../SceneObjects/Cameras/CameraNodeBase");
import RendererNode = require("./RendererNode");
import PerspectiveCamera = require("../../../Core/Camera/PerspectiveCamera");

class ViewPortNode extends GomlTreeNodeBase {

  private parentRendererNode:RendererNodeBase;

  private targetRenderer:RendererBase;

  public get TargetViewport():RendererBase
  {
    return this.targetRenderer;
  }

    constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
    {
        super(elem,loader,parent);
    }

    public afterLoad(){
      var rdr:RendererNodeBase=this.parentRendererNode=<RendererNodeBase>this.parent;
      var defaultRect = rdr.CanvasManager.getDefaultRectangle();
      this.targetRenderer=new RendererBase(rdr.CanvasManager,defaultRect);
      var context:JThreeContext=JThreeContextProxy.getJThreeContext();
      var cameraNode=this.resolveCamera();
      this.targetRenderer.Camera=cameraNode.TargetCamera;
      var scene:Scene=cameraNode.ContainedSceneNode.targetScene;
      scene.addRenderer(this.targetRenderer);

      if ("resize" in rdr ) {
          var castedRdr = <RendererNode>rdr;
          castedRdr.resize(this.updateViewportArea.bind(this));
      }

      //register attributes
      this.attributes.defineAttribute({
        "width":{
          value:defaultRect.Width,
          converter:"number",handler:v=>{
            this.width=v.Value;
            this.updateViewportArea();
          }
        },
        "height":{
          value:defaultRect.Height,
          converter:"number",handler:v=>{
            this.height=v.Value;
            this.updateViewportArea();
          }
        },
        "left":{
          value:defaultRect.Left,
          converter:"number",handler:v=>{
            this.left=v.Value;
            this.updateViewportArea();
          }
        },
        "top":{
          value:defaultRect.Top,
          converter:"number",handler:v=>{
            this.top=v.Value;
            this.updateViewportArea();
          }
        },
        "backgroundType":
        {
          value:"color",
          converter:"string",
          handler:v =>{

          }
        },
        "skybox":
        {
          value:null,
          converter:"string",
          handler:v=>{
            if(this.attributes.getValue("backgroundType")==="skybox")
            {
              var cubeTexture = this.loader.nodeRegister.getObject("jthree.resource.cubetexture",v.Value);
              if(cubeTexture)
              {
                //TODO I need to update stage chain class in renderstage
              }
            }
          }
        }
      });
      this.attributes.applyDefaultValue();
    }

    private updateViewportArea() {

        if ("targetFrame" in this.parentRendererNode) {
            var castedRdr = <RendererNode>this.parentRendererNode;
            var frame = castedRdr.targetFrame;

            castedRdr.resize(this.updateViewportArea.bind(this));
            var W = frame.clientWidth;
            var H = frame.clientHeight;
            var left = this.left > 1 ? this.left : W * this.left;
            var top = this.top > 1 ? this.top : H * this.top;
            var width = this.width > 1 ? this.width : W * this.width;
            var height = this.height > 1 ? this.height : H * this.height;
            this.targetRenderer.ViewPortArea = new Rectangle(left, top, width, height);

            if ("Aspect" in this.targetRenderer.Camera) {//todo Camera�����n���h���o�^������
                var castedCam = <PerspectiveCamera>this.targetRenderer.Camera;
                castedCam.Aspect = width / height;
            }
        } else {
            this.targetRenderer.ViewPortArea = new Rectangle(this.left, this.top, this.width, this.height);

            if ("Aspect" in this.targetRenderer.Camera) {
                var castedCam = <PerspectiveCamera>this.targetRenderer.Camera;
                castedCam.Aspect = this.width / this.height;
            }
        }

    }

    private resolveCamera():CameraNodeBase
    {
      var camTags=this.loader.nodeRegister.getAliasMap<SceneObjectNodeBase>("jthree.camera");
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

    public get Cam():string
    {
      this.cam=this.cam||this.element.getAttribute('cam');
      return this.cam;
    }

}

export=ViewPortNode;
