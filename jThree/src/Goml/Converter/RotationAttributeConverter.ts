import JThreeObject = require("../../Base/JThreeObject");
import Exceptions = require("../../Exceptions");
import AttributeParser = require("../AttributeParser");
import AttributeRotationBase = require("./AttributeConverterBase");
import RotationAnimater = require("../Animater/RotationAnimater");
import GomlAttribute = require("../GomlAttribute");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import Delegates = require("../../Delegates");
import AnimaterBase = require("../Animater/AnimaterBase");

class RotationAttributeConverter extends JThreeObject
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
    return AttributeParser.ParseRotation3D(attr);
  }

  public FromInterface(val:any):any
  {
    if(typeof val === 'string')
    {
      return this.FromAttribute(val);
    }else if(typeof val === 'object')
    {
      return val;
    }
    //we should implememnt something here?
    throw new Exceptions.InvalidArgumentException("val can't parse");
  }

  public GetAnimater(attr:GomlAttribute,beginVal:any,endVal:any,beginTime:number,duration:number,easing:EasingFunctionBase,onComplete?:Delegates.Action0):AnimaterBase
  {
    return new RotationAnimater(attr,beginTime,duration,beginVal,endVal,easing,onComplete);
  }
}

export=RotationAttributeConverter;
