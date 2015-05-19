import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import GomlLoader = require("../../../GomlLoader");
import JThreeID = require("../../../../Base/JThreeID");
import SceneObjectNodeBase = require("../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import Camera = require("../../../../Core/Camera/Camera");
import ViewCamera = require("../../../../Core/Camera/ViewCameraBase");
import PerspectiveCamera = require("../../../../Core/Camera/PerspectiveCamera");
import SceneObject = require("../../../../Core/SceneObject");
import AttributeParser = require("../../../AttributeParser");
import Vector3 = require("../../../../Math/Vector3");
class GomlTreeCameraNodeBase extends SceneObjectNodeBase
{
  private targetCamera:Camera;

  public get TargetCamera():Camera
  {
    return this.targetCamera;
  }

  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:GomlTreeSceneNode,parentObject:SceneObjectNodeBase)
  {
      super(elem,loader,parent,parentSceneNode,parentObject);
      loader.nodeDictionary.addObject("jthree.camera",this.Name,this);
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

  beforeLoad()
  {
    super.beforeLoad();
  }

  Load()
  {
    super.Load();
    this.ContainedSceneNode.targetScene.addCamera(this.targetCamera);

  }

  private name:string;
  /**
  * GOML Attribute
  * Identical Name for camera
  */
  get Name():string{
    this.name=this.name||this.element.getAttribute('name')||JThreeID.getUniqueRandom(10);
    return this.name;
  }
}

export=GomlTreeCameraNodeBase;
