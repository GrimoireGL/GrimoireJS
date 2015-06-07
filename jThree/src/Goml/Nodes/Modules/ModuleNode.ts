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
          debugger;
          //load default value
          if(typeof module.order !== 'undefined')this.cachedOrder=module.order;
          if(typeof module.enabled !== 'undefined')this.cachedEnabled=module.enabled;
          this.attributes.defineAttribute(
            {
              "enabled":{
                converter:"boolean",
                value:true,
                handler:(v)=>{this.enabled=v.Value;}
              }
            }
          );
          moduleTarget.addModule(this);
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
	
	private cachedEnabled:boolean=true;
	public get enabled():boolean
	{
		return this.cachedEnabled;
	}
	
	public set enabled(en:boolean)
	{
		this.cachedEnabled=en;
	}
  
  public update()
  {
    console.log("update");
  }
	
}

export =ModuleNode;
