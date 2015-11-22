import TagFactory = require("./TagFactory");
import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import BehaviorsNode = require("../Nodes/Behaviors/BehaviorsNode");
/**
* Goml tree node factory for the node extending SceneObjectNodeBase
*/
class ComponentTagFactory extends TagFactory
{
    public CreateNodeForThis(elem: Element,parent:GomlTreeNodeBase): GomlTreeNodeBase {
    if(parent.getTypeName()==="BehaviorsNode")
    {
      var castedParent=<BehaviorsNode>parent;
      return new this.nodeType(elem,parent,castedParent.ComponentTarget);
    }
  }
}

export=ComponentTagFactory;
