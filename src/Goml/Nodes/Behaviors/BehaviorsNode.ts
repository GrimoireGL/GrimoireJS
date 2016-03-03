import GomlTreeNodeBase from "../../GomlTreeNodeBase";


class BehaviorsNode extends GomlTreeNodeBase {
  private _componentTarget: GomlTreeNodeBase;

  constructor() {
    super();
  }

  protected __onMount(): void {
    super.__onMount();
    this._componentTarget = <GomlTreeNodeBase>this.__parent;
  }

  public get ComponentTarget(): GomlTreeNodeBase {
    return this._componentTarget;
  }
}

export default BehaviorsNode;
