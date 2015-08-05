import EasingFunctionBase = require("./EasingFunctionBase");
class LinearEasingFunction extends EasingFunctionBase
{
  public Ease(begin:number,end:number,progress:number):number
  {
    return begin+(end-begin)*progress;
  }
}

export=LinearEasingFunction;
