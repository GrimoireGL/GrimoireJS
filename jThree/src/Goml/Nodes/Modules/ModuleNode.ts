import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");


class ModuleNode extends GomlTreeNodeBase
{
  private static ignoreNode:string[]=["name"];

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
  }
}

export =ModuleNode;
