import JThreeObject=require('../../Base/JThreeObject');
import GomlLoader = require("../GomlLoader");
import TagFactory = require("./TagFactory");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import GomlTreeSceneNode = require("../Nodes/SceneNode");
import SceneObjectNodeBase = require("../Nodes/SceneObjects/SceneObjectNodeBase");
import Exceptions = require("../../Exceptions");
import ModulesNode = require('../Nodes/Modules/ModulesNode');
/**
* Goml tree node factory for the node extending SceneObjectNodeBase
*/
class ModuleTagFactory extends TagFactory
{
  CreateNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase): GomlTreeNodeBase {
    if(parent.getTypeName()==="ModulesNode")
    {
      var castedParent=<ModulesNode>parent;
      return new this.nodeType(elem,loader,parent,castedParent.ModuleTarget);
    }
  }
}

export=ModuleTagFactory;
