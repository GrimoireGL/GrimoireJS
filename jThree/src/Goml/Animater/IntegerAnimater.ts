import AnimagterBase = require("./AnimaterBase");

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
