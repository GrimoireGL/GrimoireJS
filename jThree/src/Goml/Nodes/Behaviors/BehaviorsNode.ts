import GomlTreeNodeBase from "../../GomlTreeNodeBase";


class BehaviorsNode extends GomlTreeNodeBase {
  private componentTarget: GomlTreeNodeBase;

  constructor() {
    super();
  }

  protected onMount(): void {
    super.onMount();
    this.componentTarget = <GomlTreeNodeBase>this.parent;
  }

  public get ComponentTarget(): GomlTreeNodeBase {
    return this.componentTarget;
  }
}

export default BehaviorsNode;
