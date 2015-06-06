import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");


class ModulesNode extends GomlTreeNodeBase
{

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
      this.moduleTarget=parent;
  }

  private moduleTarget:GomlTreeNodeBase;

  public get ModuleTarget():GomlTreeNodeBase
  {
    return this.moduleTarget;
  }
}

export =ModulesNode;
