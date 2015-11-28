import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import Delegates = require("../../../Base/Delegates");
import TreeNodeBase = require("../../TreeNodeBase");
class LoaderNode extends GomlTreeNodeBase {
  constructor(elem: HTMLElement, parent: GomlTreeNodeBase) {
    super(elem, parent);
  }
}

export = LoaderNode;
