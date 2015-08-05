import GomlLoader = require("../GomlLoader");
import TagFactory = require("./TagFactory");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import ComponentNode = require("../Nodes/Components/ComponentsNode");
/**
* Goml tree node factory for the node extending SceneObjectNodeBase
*/
class ComponentTagFactory extends TagFactory
{
  CreateNodeForThis(elem: Element,loader:GomlLoader,parent:GomlTreeNodeBase): GomlTreeNodeBase {
    if(parent.getTypeName()==="ComponentsNode")
    {
      var castedParent=<ComponentNode>parent;
      return new this.nodeType(elem,loader,parent,castedParent.ComponentTarget);
    }
  }
}

export=ComponentTagFactory;
