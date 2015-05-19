import JThreeObject=require('Base/JThreeObject');
import AttributeParser = require("../../../AttributeParser");
import GomlTreeNodeBase = require("../../../GomlTreeNodeBase");
import GomlLoader = require("../../../GomlLoader");
import JThreeID = require("../../../../Base/JThreeID");
import SceneObjectNodeBase = require("../../SceneObjectNodeBase");
import GomlTreeSceneNode = require("../../SceneNode");
import Camera = require("../../../../Core/Camera/Camera");
import ViewCamera = require("../../../../Core/Camera/ViewCameraBase");
import PerspectiveCamera = require("../../../../Core/Camera/PerspectiveCamera");
import SceneObject = require("../../../../Core/SceneObject");
import GomlTreeCameraNodeBase = require("./CameraNodeBase");
import Quaternion = require("../../../../Math/Quaternion");
import Vector3 = require("../../../../Math/Vector3");
class GomlTreeCameraNode extends GomlTreeCameraNodeBase
{

  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:GomlTreeSceneNode,parentObject:SceneObjectNodeBase)
  {
      super(elem,loader,parent,parentSceneNode,parentObject);
  }

  protected ConstructCamera():Camera
  {
    var camera=new PerspectiveCamera();
    camera.Fovy=this.Fovy;
    camera.Aspect=this.Aspect;
    camera.Near=this.Near;
    camera.Far=this.Far;
    return camera;
  }

  private fovy:number;

  get Fovy():number
  {
    this.fovy=this.fovy||AttributeParser.ParseAngle(this.element.getAttribute('fovy')||'60d');
    return this.fovy;
  }

  private aspect:number;

  get Aspect():number
  {
    this.aspect=this.aspect||parseFloat(this.element.getAttribute('aspect'));
    return this.aspect;
  }

  private near:number;

  get Near():number
  {
    this.near=this.near||parseFloat(this.element.getAttribute('near'));
    return this.near;
  }

  private far:number;

  get Far():number
  {
    this.far=this.far||parseFloat(this.element.getAttribute('far'));
    return this.far;
  }
}

export=GomlTreeCameraNode;
