import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Delegates = require('../../../Delegates');
import GomlAttribute = require('../../GomlAttribute');
import AttributeDeclaration = require('../../AttributeDeclaration');
class ModuleNode extends GomlTreeNodeBase
{
  private static ignoreNode:string[]=["name","cachedOrder","cachedEnabled","children","parent","loader","element"];

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase,moduleTarget:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
      if(elem.getAttribute("name"))
      {
        var module=loader.moduleRegistry.getModule(elem.getAttribute("name"));
        if(module)
        {
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
          for(var attrKey in module.attributes)
          {
            var attr = module.attributes[attrKey];
            if(ModuleNode.ignoreNode.indexOf(attrKey)!==-1||this.attributes.isDefined(attrKey))
            {//duplicated or protected attribute
              console.error(`attribute name '${attrKey}' is protected attribute name. please change name`);
              continue;
            }
            //create handler
            var newHandler:Delegates.Action1<GomlAttribute>
            =attr.handler?
            (v)=>{
              this[attrKey]=v.Value;
              attr.handler(v);
            }
            :
            (v)=>
            {
              this[attrKey]=v.Value;
            };
            //recreate attribute body
            var attributeBody={
               converter:attr.converter,
               value:attr.value,
               handler:newHandler
              };
             var attributeContainer:AttributeDeclaration={};
             attributeContainer[attrKey]=attributeBody;
            this.attributes.defineAttribute(attributeContainer);
          }
          this.attributes.applyDefaultValue();
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

  }
	
}

export =ModuleNode;
