import JThreeObject = require("../Base/JThreeObject");
import JThreeCollection = require("../Base/JThreeCollection");
import GomlAttribute = require("./GomlAttribute");
import Delegates = require("../Delegates");
import GomlLoader = require("./GomlLoader");
import AnimaterBase = require("./Animater/AnimaterBase");
import EasingFunctionBase = require("./Easing/EasingFunctionBase");
class AttributeDictionary extends JThreeObject
{
  constructor(loader:GomlLoader,element:HTMLElement)
  {
    super();
    this.loader=loader;
    this.element=element;
  }

  private loader:GomlLoader;

  private element:HTMLElement;

  private attributes:JThreeCollection<GomlAttribute>=new JThreeCollection<GomlAttribute>();

  public getValue(attrName:string):any
  {
    var attr=this.attributes.getById(attrName);
    if(attr==null)console.warn("attribute \"{0}\" is not found.".format(attrName));
    else
      return attr.Value;
  }

  public setValue(attrName:string,value:any):void
  {
    var attr=this.attributes.getById(attrName);
    if(attr==null)console.warn("attribute \"{0}\" is not found.".format(attrName));
    else
      attr.Value=value;;
  }


  public getAnimater(attrName:string,beginTime:number,duration:number,beginVal:any,endVal:any,easing:EasingFunctionBase,onComplete?:Delegates.Action0)
  {
    var attr=this.attributes.getById(attrName);
    if(attr==null)console.warn("attribute \"{0}\" is not found.".format(attrName));
    else
      return attr.Converter.GetAnimater(attr,beginVal,endVal,beginTime,duration,easing,onComplete);
  }

  public isDefined(attrName:string):boolean
  {
    return this.attributes.getById(attrName)!=null;
  }

  public defineAttribute(attributes:{[key:string]:{value?:any;converter:string;handler?:Delegates.Action1<GomlAttribute>}})
  {
    for(var key in attributes)
    {
      var attribute=attributes[key];
      this.attributes.insert(new GomlAttribute(this.element,key,attribute.value,this.loader.Configurator.getConverter(attribute.converter),attribute.handler));
    }
  }
}

export=AttributeDictionary;
