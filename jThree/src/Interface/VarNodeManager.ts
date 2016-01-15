import NodeManager = require('../Goml/NodeManager');
import JThreeContext = require('../JThreeContext');
import ContextComponents = require('../ContextComponents');

const nodeManager: NodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);

export = nodeManager;
