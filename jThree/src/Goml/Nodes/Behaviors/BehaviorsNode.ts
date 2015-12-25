import GomlTreeNodeBase = require("../../GomlTreeNodeBase");


class BehaviorsNode extends GomlTreeNodeBase {

  constructor() {
    super();
  }

  protected nodeWillMount(parent) {
    super.nodeWillMount(parent);
    this.componentTarget = parent;
  }

  private componentTarget: GomlTreeNodeBase;

  public get ComponentTarget(): GomlTreeNodeBase {
    return this.componentTarget;
  }
}

export = BehaviorsNode;
