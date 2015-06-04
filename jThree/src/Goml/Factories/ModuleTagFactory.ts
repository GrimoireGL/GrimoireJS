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
class ModuleTagFactory extends TagFactory
{
  CreateNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase): GomlTreeNodeBase {
    if(parent.getTypeName()==="ModulesNode")
    {
      return new this.nodeType(elem,loader,parent)
    }
  }

  CreateSceneObjectNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,containedSceneNode:GomlTreeSceneNode,parentSceneObjectNode:SceneObjectNodeBase):SceneObjectNodeBase
  {
    return new this.nodeType(elem,loader,parent,containedSceneNode,parentSceneObjectNode);
  }

}

export=ModuleTagFactory;
