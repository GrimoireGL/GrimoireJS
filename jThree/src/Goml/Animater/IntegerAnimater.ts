import JThreeObject = require("../../Base/JThreeObject");
import GomlAttribute = require("../GomlAttribute");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import Delegates = require("../../Delegates");
import AnimagterBase = require("./AnimaterBase");
import Vector3 = require("../../Math/Vector3");
class IntegerAnimater extends AnimagterBase
{

  protected updateAnimation(progress:number):void
  {
    var b=<number>this.beginValue;
    var e=<number>this.endValue;
    var ef=this.easingFunction.Ease;
    var val=Math.floor(ef(b,e,progress));
    if(this.targetAttribute.Value!==val)
      this.targetAttribute.Value = val;
  }
}

export=IntegerAnimater;
