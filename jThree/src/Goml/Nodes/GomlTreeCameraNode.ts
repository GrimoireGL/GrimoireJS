import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
import JThreeID = require("../../Base/JThreeID");
import GomlTreeSceneObjectNodeBase = require("./GomlTreeSceneObjectNodeBase");
import GomlTreeSceneNode = require("./GomlTreeSceneNode");
import Camera = require("../../Core/Camera/Camera");
import ViewCamera = require("../../Core/Camera/ViewCameraBase");
import PerspectiveCamera = require("../../Core/Camera/PerspectiveCamera");
import SceneObject = require("../../Core/SceneObject");
import AttributeParser = require("../AttributeParser");
class GomlTreeCameraNode extends GomlTreeSceneObjectNodeBase
{
  private targetCamera:PerspectiveCamera;

  public get TargetCamera():Camera
  {
    return this.targetCamera;
  }

  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:GomlTreeSceneNode,parentObject:GomlTreeSceneObjectNodeBase)
  {
      super(elem,loader,parent,parentSceneNode,parentObject);
      loader.nodeDictionary.addObject("jthree.camera",this.Name,this);
  }

  protected ConstructTarget():SceneObject
  {
    this.targetCamera=new PerspectiveCamera();
    this.targetCamera.Fovy=this.Fovy;
    this.targetCamera.Aspect=this.Aspect;
    this.targetCamera.Near=this.Near;
    this.targetCamera.Far=this.Far;
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
