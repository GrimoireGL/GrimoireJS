import JThreeObject=require('Base/JThreeObject');
import GomlLoader = require("../GomlLoader");
import GomlTagBase = require("../GomlTagBase");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlTreeSceneNode = require("../Nodes/GomlTreeSceneNode");
import GomlTreeSceneObjectNodeBase = require("../Nodes/GomlTreeSceneObjectNodeBase");
import Exceptions = require("../../Exceptions");
/**
* Goml tree node factory for the node extending GomlTreeSceneObjectNodeBase
*/
class GomlSceneObjectTagBase extends GomlTagBase
{
  CreateNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase): GomlTreeNodeBase {
    var sceneNode:GomlTreeSceneNode=null;
    var sceneObjectNode:GomlTreeSceneObjectNodeBase=null;
    if(parent.getTypeName()=="GomlTreeSceneNode")//This parent node is scene node.
    {
      sceneNode=<GomlTreeSceneNode>parent;
      sceneObjectNode=null;
    }else{
      if(typeof parent["ContainedSceneName"]==="undefined")
      {//check parent extends GomlTreeSceneObjectNodeBase or not.
        console.error("{0} is not extends GomlTreeSceneObjectNodeBase. Is this really ok to be contained in Scene tag?".format(parent.toString()));
        return null;
      }else
      {
        sceneObjectNode=<GomlTreeSceneObjectNodeBase>parent;
        sceneNode=sceneObjectNode.ContainedSceneNode;
      }
    }
    return this.CreateSceneObjectNodeForThis(elem,loader,parent,sceneNode,sceneObjectNode);
  }

  CreateSceneObjectNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,containedSceneNode:GomlTreeSceneNode,parentSceneObjectNode:GomlTreeSceneObjectNodeBase):GomlTreeSceneObjectNodeBase
  {
    throw new Exceptions.AbstractClassMethodCalledException();
  }

  get TagName(): string { return ""; }
}

export=GomlSceneObjectTagBase;
