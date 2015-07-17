import JThreeObject=require('../../../Base/JThreeObject');
import GomlLoader = require("../../../Goml/GomlLoader");
import TagFactory = require("../../../Goml/Factories/TagFactory");
import GomlTreeNodeBase = require("../../../Goml/GomlTreeNodeBase");
import SceneNode = require("../../../Goml/Nodes/SceneNode");
import SceneObjectNodeBase = require("../../../Goml/Nodes/SceneObjects/SceneObjectNodeBase");
/**
* Goml tree node factory for the node extending SceneObjectNodeBase
*/
class PMXModelContentTagFactory extends TagFactory
{
  CreateSceneObjectNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase,containedSceneNode:SceneNode,parentSceneObjectNode:SceneObjectNodeBase):SceneObjectNodeBase
  {
    return new this.nodeType(elem,loader,parent,containedSceneNode,parentSceneObjectNode);
  }

}

export=PMXModelContentTagFactory;
