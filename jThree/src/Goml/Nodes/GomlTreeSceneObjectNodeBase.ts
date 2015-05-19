import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
import JThreeID = require("../../Base/JThreeID");
import GomlTreeSceneNode = require("./GomlTreeSceneNode");
import SceneObject = require("../../Core/SceneObject");
import Vector3 = require("../../Math/Vector3");
import Quaternion = require("../../Math/Quaternion");
import AttributeParser = require("../AttributeParser");
class GomlTreeSceneObjectNodeBase extends GomlTreeNodeBase
{
  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:GomlTreeSceneNode,parentObject:GomlTreeSceneObjectNodeBase)
  {
      super(elem,loader,parent);
      this.containedSceneNode=parentSceneNode;
      this.parentSceneObjectNode=parentObject;
  }

  protected ConstructTarget():SceneObject
  {
    return null;
  }

  public beforeLoad():void
  {
    super.beforeLoad();
    this.targetSceneObject=this.ConstructTarget();
    //append targetObject to parent
    if(!this.targetSceneObject)
    {
      console.error("SceneObject node must override ConstructTarget and return the object extending SceneObjnect");
    }else
    {
      if(this.parentSceneObjectNode==null)//this is root object of scene
        this.containedSceneNode.targetScene.addObject(this.targetSceneObject);
      else
      {
        this.parentSceneObjectNode.targetSceneObject.addChild(this.targetSceneObject);
        this.ContainedSceneNode.targetScene.addRenderQueue(this.targetSceneObject);
      }
    }
    this.targetSceneObject.Transformer.Position=this.Position;
    this.targetSceneObject.Transformer.Rotation=this.Rotation;
    this.targetSceneObject.Transformer.Scale=this.Scale;
  }

  protected targetSceneObject:SceneObject;

/**
* SceneNode containing this node
*/
  private containedSceneNode:GomlTreeSceneNode=null;

  public get ContainedSceneNode():GomlTreeSceneNode
  {
    return this.containedSceneNode;
  }

/**
* SceneObjectNode directly containing this node
*/
  private parentSceneObjectNode:GomlTreeSceneObjectNodeBase=null;

  public get ParentSceneObjectNode():GomlTreeSceneObjectNodeBase
  {
    return this.parentSceneObjectNode;
  }

  private position:Vector3;

  public get Position():Vector3
  {
    return  this.position||Vector3.parse(this.element.getAttribute('position')||"0");
  }

  private rotation:Quaternion;

  public get Rotation():Quaternion
  {
    return  this.rotation||AttributeParser.ParseRotation3D(this.element.getAttribute('rotation')||"x(0)");
  }

  private scale:Vector3;

  public get Scale():Vector3
  {
    return  this.scale||Vector3.parse(this.element.getAttribute('scale')||"1");
  }

}

export=GomlTreeSceneObjectNodeBase;
