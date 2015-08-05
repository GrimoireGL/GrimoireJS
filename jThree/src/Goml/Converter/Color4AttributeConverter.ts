import AttributeConverterBase = require("./AttributeConverterBase");
import Exceptions = require("../../Exceptions");
import GomlAttribute = require("../GomlAttribute");
import Delegates = require("../../Base/Delegates");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import AnimaterBase = require("../Animater/AnimaterBase");
import Color4 = require("../../Base/Color/Color4");
import Color4Animater = require("../Animater/Color4Animater");
class Color4AttributeConverter extends AttributeConverterBase
{
  constructor()
  {
    super();
  }

  public ToAttribute(val:any):string
  {
    return val;
  }

  public FromAttribute(attr:string):any
  {
    return Color4.parseColor(attr);
  }

  public FromInterface(val:any):any
  {
    if(typeof val === "string")
    {
      return Color4.parseColor(val);
    }else if(typeof val === "object")
    {
      return val;
    }
    //we should implememnt something here?
    throw new Exceptions.InvalidArgumentException("val can't parse");
  }

  public GetAnimater(attr:GomlAttribute,beginVal:any,endVal:any,beginTime:number,duration:number,easing:EasingFunctionBase,onComplete?:Delegates.Action0):AnimaterBase
  {
    return new Color4Animater(attr,beginTime,duration,beginVal,endVal,easing,onComplete);
  }
}

export=Color4AttributeConverter;
