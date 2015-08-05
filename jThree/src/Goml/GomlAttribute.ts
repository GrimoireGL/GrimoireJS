import JThreeObjectWithID = require("../Base/JThreeObjectWithID");
import AttributeConverterBase = require("./Converter/AttributeConverterBase");
import Delegates = require("../Base/Delegates");
import GomlTreeNodeBase = require('./GomlTreeNodeBase');
import JThreeEvent = require('../Base/JThreeEvent')
class GomlAttribute extends JThreeObjectWithID
{
  protected element:HTMLElement;

  protected cached:boolean=false;

  protected value:any=undefined;

  protected converter:AttributeConverterBase;

  protected onchangedHandlers:JThreeEvent<GomlAttribute>=new JThreeEvent<GomlAttribute>();

  protected managedClass: GomlTreeNodeBase;

  private needNotifyUpdate: boolean = true;

  public get NeedNotifyUpdate()
  {
    return this.needNotifyUpdate;
  }

  public set NeedNotifyUpdate(val:boolean)
  {
    this.needNotifyUpdate = val;
  }

  constructor(node:GomlTreeNodeBase,element:HTMLElement,name:string,value:any,converter:AttributeConverterBase,handler?:Delegates.Action1<GomlAttribute>)
  {
    super(name);
    this.element=element;
    this.converter=converter;
    this.value=converter.FromInterface(value);
    this.managedClass=node;
    if(handler)this.onchangedHandlers.addListerner(handler);
  }

  get Name():string
  {
    return this.ID;
  }

  get Value():any
  {
    if(this.cached)
    {
      return this.value;
    }else{
      var attr=this.element.getAttribute(this.Name);
      if(attr)
      {//if attribute was specified, cache this attribute.
        this.value=this.Converter.FromAttribute(this.element.getAttribute(this.Name));
        this.cached=true;
      }//if attribute was not specified, it will return default value of this attribute.
      return this.value;
    }
  }

  set Value(val:any)
  {
    this.value=this.Converter.FromInterface(val);
    this.element.setAttribute(this.Name,this.Converter.ToAttribute(val));
    this.cached=true;
    if(this.NeedNotifyUpdate)this.notifyValueChanged();
  }

  get Converter():AttributeConverterBase
  {
    return this.converter;
  }

  public notifyValueChanged()
  {
    var t=this;
    this.onchangedHandlers.fire(this,this);
  }

  public onValueChanged(handler:Delegates.Action1<GomlAttribute>)
  {
    this.onchangedHandlers.addListerner(handler);
  }
}

export=GomlAttribute;
