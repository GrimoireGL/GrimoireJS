import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import GomlLoader = require("../../../GomlLoader");
import JThreeID = require("../../../../Base/JThreeID");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import Camera = require("../../../../Core/Camera/Camera");
import SceneObject = require("../../../../Core/SceneObject");

class GomlTreeCameraNodeBase extends SceneObjectNodeBase
{
  private targetCamera:Camera;

  public get TargetCamera():Camera
  {
    return this.targetCamera;
  }

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:GomlTreeSceneNode,parentObject:SceneObjectNodeBase)
  {
      super(elem,loader,parent,parentSceneNode,parentObject);
      loader.nodeRegister.addObject("jthree.camera",this.Name,this);
  }

  protected ConstructCamera():Camera
  {
    return null;
  }

  protected ConstructTarget():SceneObject
  {
    this.targetCamera=this.ConstructCamera();
    return this.targetCamera;
  }

    public beforeLoad()
  {
    super.beforeLoad();
  }

    public Load()
  {
    super.Load();
    this.ContainedSceneNode.targetScene.addCamera(this.targetCamera);

  }

  private name:string;
  /**
  * GOML Attribute
  * Identical Name for camera
  */
    public get Name():string{
    this.name=this.name||this.element.getAttribute('name')||JThreeID.getUniqueRandom(10);
    return this.name;
  }
}

export=GomlTreeCameraNodeBase;
