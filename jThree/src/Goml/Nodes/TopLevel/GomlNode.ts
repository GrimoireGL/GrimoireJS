import GomlTreeNodeBase = require("../../GomlTreeNodeBase");

class GomlNode extends GomlTreeNodeBase {
  constructor(elem: HTMLElement, parent: GomlTreeNodeBase, parentSceneNode: SceneNode, parentObject: GomlNode) {
    super(elem, parent);
  }

}

export = GomlNode;
