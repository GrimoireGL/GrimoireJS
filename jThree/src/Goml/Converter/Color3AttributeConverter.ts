import JThreeObject = require("../../Base/JThreeObject");
import AttributeConverterBase = require("./AttributeConverterBase");
import AttributeParser = require("../AttributeParser");
import Exceptions = require("../../Exceptions");
import GomlAttribute = require("../GomlAttribute");
import Delegates = require("../../Base/Delegates");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import AnimaterBase = require("../Animater/AnimaterBase");
import NumberAnimater = require("../Animater/NumberAnimater");
import Vector3 = require("../../Math/Vector3");
import Vector3Animater = require("../Animater/Vector3Animater");
import Color3 = require("../../Base/Color/Color3");
import Color4Animater = require("../Animater/Color4Animater");
class Color3AttributeConverter extends AttributeConverterBase
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
    return Color3.parseColor(attr);
  }

  public FromInterface(val:any):any
  {
    if(typeof val === 'string')
    {
      return Color3.parseColor(val);
    }else if(typeof val === 'object')
    {
      return val;
    }
    //we should implememnt something here?
    throw new Exceptions.InvalidArgumentException("val can't parse");
  }

  public GetAnimater(attr:GomlAttribute,beginVal:any,endVal:any,beginTime:number,duration:number,easing:EasingFunctionBase,onComplete?:Delegates.Action0):AnimaterBase
  {
    return null;
  }
}

export=Color3AttributeConverter;
