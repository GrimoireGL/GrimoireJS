import JThreeObjectWithID = require("../Base/JThreeObjectWithID");
import AttributeConverterBase = require("./Converter/AttributeConverterBase");
import Exceptions = require("../Exceptions");
import Delegates = require("../Delegates");
class GomlAttribute extends JThreeObjectWithID
{
  protected element:HTMLElement;

  protected cached:boolean=false;

  protected value:any;

  protected converter:AttributeConverterBase;

  protected onchangedHandlers:Delegates.Action1<GomlAttribute>[]=[];

  constructor(element:HTMLElement,name:string,value:any,conveter:AttributeConverterBase,handler?:Delegates.Action1<GomlAttribute>)
  {
    super(name);
    this.element=element;
    this.value=value;
    this.converter=conveter;
    if(handler)this.onchangedHandlers.push(handler);
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
      if(attr)this.value=this.Converter.FromAttribute(this.element.getAttribute(this.Name));
      this.cached=true;
      return this.value;
    }
  }

  set Value(val:any)
  {
    this.value=this.Converter.FromInterface(val);
    this.element.setAttribute(this.Name,this.Converter.FromAttribute(val));
    this.cached=true;
    this.notifyValueChanged();
  }

  get Converter():AttributeConverterBase
  {
    return this.converter;
  }

  private notifyValueChanged()
  {
    var t=this;
    this.onchangedHandlers.forEach(v=>v(t));
  }
}

export=GomlAttribute;
