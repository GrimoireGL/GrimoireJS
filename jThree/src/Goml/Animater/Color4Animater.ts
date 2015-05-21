import JThreeObject = require("../../Base/JThreeObject");
import GomlAttribute = require("../GomlAttribute");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import Delegates = require("../../Delegates");
import AnimagterBase = require("./AnimaterBase");
import Vector3 = require("../../Math/Vector3");
import Color4 = require("../../Base/Color/Color4");
class Color4Animater extends AnimagterBase
{

  protected updateAnimation(progress:number):void
  {
    var b=<Color4>this.beginValue;
    var e=<Color4>this.endValue;
    var ef=this.easingFunction.Ease;
    this.targetAttribute.Value=new Color4(ef(b.R,e.R,progress),ef(b.G,e.G,progress),ef(b.B,e.B,progress),ef(b.A,b.A,progress));
  }
}

export=Color4Animater;
