import JThreeObject=require('../../Base/JThreeObject');
import GomlLoader = require("../GomlLoader");
import TagFactory = require("./TagFactory");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlTreeSceneNode = require("../Nodes/SceneNode");
import SceneObjectNodeBase = require("../Nodes/SceneObjects/SceneObjectNodeBase");
import Exceptions = require("../../Exceptions");
/**
* Goml tree node factory for the node extending SceneObjectNodeBase
*/
class SceneObjectTagFactory extends TagFactory
{
  CreateNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase): GomlTreeNodeBase {
    var sceneNode:GomlTreeSceneNode=null;
    var sceneObjectNode:SceneObjectNodeBase=null;
    if(parent.getTypeName()=="GomlTreeSceneNode")//This parent node is scene node.
    {
      sceneNode=<GomlTreeSceneNode>parent;
      sceneObjectNode=null;
    }else{
      if(typeof parent["ContainedSceneNode"]==="undefined")
      {//check parent extends SceneObjectNodeBase or not.
        console.error(`${parent.toString()} is not extends SceneObjectNodeBase. Is this really ok to be contained in Scene tag?`);
        return null;
      }else
      {
        sceneObjectNode=<SceneObjectNodeBase>parent;
        sceneNode=sceneObjectNode.ContainedSceneNode;
      }
    }
    return this.CreateSceneObjectNodeForThis(elem,loader,parent,sceneNode,sceneObjectNode);
  }

  CreateSceneObjectNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,containedSceneNode:GomlTreeSceneNode,parentSceneObjectNode:SceneObjectNodeBase):SceneObjectNodeBase
  {
    return new this.nodeType(elem,loader,parent,containedSceneNode,parentSceneObjectNode);
  }

}

export=SceneObjectTagFactory;
