import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
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

  constructor(parent:GomlTreeNodeBase,parentSceneNode:GomlTreeSceneNode,parentObject:SceneObjectNodeBase)
  {
      super(parent,parentSceneNode,parentObject);
      this.nodeManager.nodeRegister.addObject("jthree.camera",this.Name,this);
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
  }

  private name:string;
  /**
  * GOML Attribute
  * Identical Name for camera
  */
  public get Name():string{
    return this.attributes.getValue('name');
  }
}

export=GomlTreeCameraNodeBase;
