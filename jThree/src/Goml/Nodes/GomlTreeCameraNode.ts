import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
import JThreeID = require("../../Base/JThreeID");
import GomlTreeSceneObjectNodeBase = require("./GomlTreeSceneObjectNodeBase");
import GomlTreeSceneNode = require("./GomlTreeSceneNode");
import Camera = require("../../Core/Camera/Camera");
import ViewCamera = require("../../Core/Camera/ViewCamera");
class GomlTreeCameraNode extends GomlTreeSceneObjectNodeBase
{
  private targetCamera:Camera;

  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:GomlTreeSceneNode,parentObject:GomlTreeSceneObjectNodeBase)
  {
      super(elem,loader,parent,parentSceneNode,parentObject);
  }

  beforeLoad()
  {

  }

  Load()
  {
    this.targetCamera=new ViewCamera();
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

export=GomlTreeCameraNode;
