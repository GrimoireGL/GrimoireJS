import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");


class ModuleNode extends GomlTreeNodeBase
{
  private static ignoreNode:string[]=["name"];

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase,moduleTarget:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
      if(elem.getAttribute("name"))
      {
        var module=loader.moduleRegistry.getModule(elem.getAttribute("name"));
        if(module)
        {
          moduleTarget.addModule(module);
        }else{
          console.warn(`module"${elem.getAttribute("name")}" is not found.`);
        }
      }else{
        console.warn("module name was not specified");
      }
  }
	
	private cachedOrder:number=1000;
	public get order():number
	{
		return this.cachedOrder;
	}
	
	private cachedEnabled:boolean =false;
	public get enabled():boolean
	{
		return this.cachedEnabled;
	}
	
	public set enabled(en:boolean)
	{
		this.cachedEnabled=en;
	}
	
}

export =ModuleNode;
