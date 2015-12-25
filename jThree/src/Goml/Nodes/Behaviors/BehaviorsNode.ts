import GomlTreeNodeBase = require("../../GomlTreeNodeBase");


class BehaviorsNode extends GomlTreeNodeBase {

  constructor() {
    super();
  }

  protected onMount(parent) {
    super.onMount(parent);
    this.componentTarget = parent;
  }

  private componentTarget: GomlTreeNodeBase;

  public get ComponentTarget(): GomlTreeNodeBase {
    return this.componentTarget;
  }
}

export = BehaviorsNode;
