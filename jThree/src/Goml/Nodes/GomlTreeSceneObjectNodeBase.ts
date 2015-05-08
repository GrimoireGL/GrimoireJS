import JThreeObject=require('Base/JThreeObject');
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlLoader = require("../GomlLoader");
import JThreeID = require("../../Base/JThreeID");
import GomlTreeSceneNode = require("./GomlTreeSceneNode");
import SceneObject = require("../../Core/SceneObject");

class GomlTreeSceneObjectNodeBase extends GomlTreeNodeBase
{
  constructor(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,parentSceneNode:GomlTreeSceneNode,parentObject:GomlTreeSceneObjectNodeBase)
  {
      super(elem,loader,parent);
      this.containedSceneNode=parentSceneNode;
      this.parentSceneObjectNode=parentObject;
  }

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

}

export=GomlTreeSceneObjectNodeBase;
