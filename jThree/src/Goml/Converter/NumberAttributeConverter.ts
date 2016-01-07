import AttributeConverterBase = require("./AttributeConverterBase");
import Exceptions = require("../../Exceptions");
import GomlAttribute = require("../GomlAttribute");
import Delegates = require("../../Base/Delegates");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import AnimaterBase = require("../Animater/AnimaterBase");
import NumberAnimater = require("../Animater/NumberAnimater");
class NumberAttributeConverter extends AttributeConverterBase
{
  public ToAttribute(val:any):string
  {
    return val;
  }

  public FromAttribute(attr:string):any
  {
    return Number(attr);
  }

  public FromInterface(val:any):any
  {
    if(typeof val === 'string')
    {
      return Number(val);
    }else if(typeof val === 'number')
    {
      return val;
    }
    //we should implememnt something here?
    throw new Exceptions.InvalidArgumentException("val can't parse");
  }

  public GetAnimater(attr:GomlAttribute,beginVal:any,endVal:any,beginTime:number,duration:number,easing:EasingFunctionBase,onComplete?:Delegates.Action0):AnimaterBase
  {
    return new NumberAnimater(attr,beginTime,duration,beginVal,endVal,easing,onComplete);
  }
}

export=NumberAttributeConverter;
