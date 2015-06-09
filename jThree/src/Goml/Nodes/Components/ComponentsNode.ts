import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");


class ComponentsNode extends GomlTreeNodeBase
{

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
      this.componentTarget=parent;
  }

  private componentTarget:GomlTreeNodeBase;

  public get ComponentTarget():GomlTreeNodeBase
  {
    return this.componentTarget;
  }
}

export =ComponentsNode;
