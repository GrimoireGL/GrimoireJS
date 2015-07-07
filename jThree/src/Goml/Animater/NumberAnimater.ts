import JThreeObject = require("../../Base/JThreeObject");
import GomlAttribute = require("../GomlAttribute");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import Delegates = require("../../Base/Delegates");
import AnimagterBase = require("./AnimaterBase");
class NumberAnimater extends AnimagterBase
{

  protected updateAnimation(progress:number):void
  {
    this.targetAttribute.Value=this.easingFunction.Ease(this.beginValue,this.endValue,progress);
  }
}

export=NumberAnimater;
