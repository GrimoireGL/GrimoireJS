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
      this.moduleTarget=moduleTarget;
      if(elem.getAttribute("name"))
      {
        var module=loader.moduleRegistry.getModule(elem.getAttribute("name"));
        if(module)
        {
          //load default value of module
          if(typeof module.order !== 'undefined')this.cachedOrder=module.order;
          if(typeof module.enabled !== 'undefined')var moduleEnabled=module.enabled;
            else
            moduleEnabled=true;
          if(typeof module.awake === 'function')this.awakeDelegate=module.awake;
          if(typeof module.update === 'function')this.updateDelegate=module.update;
          if(typeof module.start === 'function')this.startDelegate=module.start;
          if(typeof module.onEnabled === 'function')this.onEnabledDelegate=module.onEnabled;
          if(typeof module.onDisabled === 'function')this.onDisabledDelegate = module.onDisabled;
          //define module
          this.attributes.defineAttribute(
            {
              "enabled":{
                converter:"boolean",
                value:moduleEnabled,
                handler:(v)=>{//when enabled attribute changed
                  if(v.Value===this.enabled&&typeof v.Value === 'undefined'){
                    this.cachedEnabled=true;
                    this.onEnabled(this.moduleTarget);
                  }
                  if(v.Value===this.enabled)return;
                  if(v.Value)this.onEnabled(this.moduleTarget);
                    else
                    this.onDisabled(this.moduleTarget);
                  this.enabled=v.Value;
                  }
              }
            }
          );
          //initialize module attributes
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
          moduleTarget.addModule(this);
          this.attributes.applyDefaultValue();
        }else{
          console.warn(`module"${elem.getAttribute("name")}" is not found.`);
        }
      }else{
        console.warn("module name was not specified");
      }
  }
	private moduleTarget:GomlTreeNodeBase;
  private awakenCache:boolean=false;
  
  public get awaken():boolean
  {
    return this.awakenCache;
  }
  
	private cachedOrder:number=1000;
	public get order():number
	{
		return this.cachedOrder;
	}
	
	private cachedEnabled:boolean=undefined;
	public get enabled():boolean
	{
		return this.cachedEnabled;
	}
	
	public set enabled(en:boolean)
	{
		this.cachedEnabled=en;
	}
  
  private updateDelegate:Delegates.Action1<GomlTreeNodeBase>=()=>{};
  public update(target:GomlTreeNodeBase)
  {
    if(!this.startCalled)this.start(target);
    this.updateDelegate(target);
  }
  
  private startCalled:boolean=false;
  private startDelegate:Delegates.Action1<GomlTreeNodeBase>=()=>{};
  public start(target:GomlTreeNodeBase)
  {
    this.startDelegate(target);
    this.startCalled=true;
  }
  
  private awakeDelegate:Delegates.Action1<GomlTreeNodeBase>=()=>{};
  public awake(target:GomlTreeNodeBase)
  {
    this.awakeDelegate(target);
    this.awakenCache=true;
  }
  
  
	private onEnabledDelegate:Delegates.Action1<GomlTreeNodeBase>=()=>{};
  public onEnabled(target:GomlTreeNodeBase)
  {
    this.onEnabledDelegate(target);
  }
  
  private onDisabledDelegate:Delegates.Action1<GomlTreeNodeBase>=()=>{};
  public onDisabled(target:GomlTreeNodeBase)
  {
    this.onDisabledDelegate(target);
  }
}

export =ModuleNode;
