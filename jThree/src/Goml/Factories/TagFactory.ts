import GomlTreeNodeBase = require("../GomlTreeNodeBase");
import jThreeObject = require("../../Base/JThreeObject");
import JThreeContext = require("../../JThreeContext");
import NodeManager = require('./../NodeManager');
import ContextComponents = require('../../ContextComponents');

/**
 * HTMLElementからGomlNodeを生成します
 */
class TagFactory { // rename candidate: NodeFactory
  /**
   * nodeManager
   * @type {NodeManager}
   */
  static nodeManager: NodeManager = JThreeContext.getContextComponent<NodeManager>(ContextComponents.NodeManager);

  /**
   * Nodeを生成します
   *
   * `nodeType`に指定されたNodeの種類より、対応するNodeを生成して返します。
   * `nodeType`は`TagFactory`を継承するクラスで指定されます。
   * @param  {GomlTreeNodeBase} parent 親のNode
   * @return {GomlTreeNodeBase}
   */
  static CreateNode(elem: HTMLElement): GomlTreeNodeBase {
    const tagName = elem.tagName;
    const nodeType = TagFactory.nodeManager.configurator.getGomlNode(tagName);
    const newNode = new (<any>nodeType)();
    return newNode;
  }
}

export=TagFactory;
