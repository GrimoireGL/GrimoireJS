import NodeManager = require("./Goml/NodeManager");
import JThreeContext = require("./JThreeContext");
import ContextComponents = require("./ContextComponents");

class InterfaceBase {

  constructor() {
    this.nodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);
  }

  protected nodeManager: NodeManager;

}

export = InterfaceBase;
