import EasingFunctionBase = require("./EasingFunctionBase");
class SwingEasingFunction extends EasingFunctionBase
{
  public Ease(begin:number,end:number,progress:number):number
  {
    var p=0.5 -Math.cos(progress*Math.PI)/2;
    return begin+(end-begin)*p;
  }
}

export=SwingEasingFunction;
