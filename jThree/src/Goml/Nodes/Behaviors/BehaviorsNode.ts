import GomlTreeNodeBase = require("../../GomlTreeNodeBase");


class BehaviorsNode extends GomlTreeNodeBase {

  constructor() {
    super();
  }

  protected onMount(): void {
    super.onMount();
    this.componentTarget = <GomlTreeNodeBase>this.parent;
  }

  private componentTarget: GomlTreeNodeBase;

  public get ComponentTarget(): GomlTreeNodeBase {
    return this.componentTarget;
  }
}

export = BehaviorsNode;
