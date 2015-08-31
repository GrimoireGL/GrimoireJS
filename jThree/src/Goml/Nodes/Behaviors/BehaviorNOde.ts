import GomlTreeNodeBase = require("../../GomlTreeNodeBase");
import GomlLoader = require("../../GomlLoader");
import Delegates = require("../../../Base/Delegates");
import GomlAttribute = require("../../GomlAttribute");
import AttributeDeclaration = require("../../AttributeDeclaration");
class BehaviorNode extends GomlTreeNodeBase
{
  private static ignoreNode:string[]=["name","cachedOrder","cachedEnabled","children","parent","loader","element"];

  constructor(elem: HTMLElement,loader:GomlLoader,parent:GomlTreeNodeBase,componentTarget:GomlTreeNodeBase)
  {
      super(elem,loader,parent);
      this.componentTarget=componentTarget;
     this.componentName=elem.getAttribute("name");
      if(this.componentName)
      {
        var component=loader.componentRegistry.getBehavior(this.componentName);
        if(component)
        {
          //load d`efault value of component
          if(typeof component.order !== "undefined")this.cachedOrder=component.order;
          if(typeof component.enabled !== "undefined")var componentEnabled=component.enabled;
            else
            componentEnabled=true;
          if(typeof component.awake === "function")this.awakeDelegate=component.awake;
          if(typeof component.update === "function")this.updateDelegate=component.update;
          if(typeof component.start === "function")this.startDelegate=component.start;
          if(typeof component.onEnabled === "function")this.onEnabledDelegate=component.onEnabled;
          if(typeof component.onDisabled === "function")this.onDisabledDelegate = component.onDisabled;
          //define component
          this.attributes.defineAttribute(
            {
              "enabled":{
                converter:"boolean",
                value:componentEnabled,
                handler:(v)=>{//when enabled attribute changed
                  if(v.Value===this.enabled&&typeof v.Value === "undefined"){
                    this.cachedEnabled=true;
                    this.onEnabled(this.componentTarget);
                  }
                  if(v.Value===this.enabled)return;
                  if(v.Value)this.onEnabled(this.componentTarget);
                    else
                    this.onDisabled(this.componentTarget);
                  this.enabled=v.Value;
                  }
              }
            }
          );
          //initialize component attributes
          for(var attrKey in component.attributes)
          {
            var attr = component.attributes[attrKey];
            if(BehaviorNode.ignoreNode.indexOf(attrKey)!==-1||this.attributes.isDefined(attrKey))
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
          componentTarget.addBehavior(this);
          this.attributes.applyDefaultValue();
        }else{
          console.warn(`component"${elem.getAttribute("name")}" is not found.`);
        }
      }else{
        console.warn("component name was not specified");
      }
  }
  /**
   * The node contains this module.
   */
	private componentTarget:GomlTreeNodeBase;
  
  private componentName:string;
  
  public get  ComponentName():string
  {
    return this.componentName;
  }
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

export =BehaviorNode;
