import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");


class BehaviorsNode extends GomlTreeNodeBase
{

  constructor(elem: HTMLElement,parent:GomlTreeNodeBase)
  {
      super(elem,parent);
      this.componentTarget=parent;
  }

  private componentTarget:GomlTreeNodeBase;

  public get ComponentTarget():GomlTreeNodeBase
  {
    return this.componentTarget;
  }
}

export =BehaviorsNode;
