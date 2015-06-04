import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");


class ModuleNode extends GomlTreeNodeBase
{
  private static ignoreNode:string[]=["name"];

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
      if(elem.getAttribute("name"))
      {
        var module=loader.moduleRegistry.getModule(elem.getAttribute("name"));
        
      }else{
        console.warn("module name was not specified");
      }
  }
}

export =ModuleNode;
