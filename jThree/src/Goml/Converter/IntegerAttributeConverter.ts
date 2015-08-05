import AttributeConverterBase = require("./AttributeConverterBase");
import IntegerAnimater = require('../Animater/IntegerAnimater');
import GomlAttribute = require('../GomlAttribute');
import EasingFunctionBase = require('../Easing/EasingFunctionBase');
import Delegates = require('../../Base/Delegates');
import AnimaterBase = require('../Animater/AnimaterBase');
class IntegerAttributeConverter extends AttributeConverterBase
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
    return parseInt(attr);
  }

  public FromInterface(val:any):any
  {
    if(typeof val ==='number')
    {
      return Math.floor(<number>val);
    }else if(typeof val === 'string')
    {
      return Math.floor(this.FromAttribute(val));
    }
  }

  public GetAnimater(attr:GomlAttribute,beginVal:any,endVal:any,beginTime:number,duration:number,easing:EasingFunctionBase,onComplete?:Delegates.Action0):AnimaterBase
  {
    return new IntegerAnimater(attr,beginTime,duration,beginVal,endVal,easing,onComplete);
  }
}

export=IntegerAttributeConverter;
