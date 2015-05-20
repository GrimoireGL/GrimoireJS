import JThreeObjectWithID = require("../../Base/JThreeObjectWithID");
import GomlAttribute = require("../GomlAttribute");
import EasingFunctionBase = require("../Easing/EasingFunctionBase");
import Delegates = require("../../Delegates");
class AnimaterBase extends JThreeObjectWithID
{
  protected targetAttribute:GomlAttribute;

  protected onComplete:Delegates.Action0;

  protected duration:number;

  protected beginTime:number;

  protected easingFunction:EasingFunctionBase;

  protected beginValue:any;

  protected endValue:any;

  constructor(targetAttribute:GomlAttribute,begintime:number,duration:number,beginValue:any,endValue:any,easing:EasingFunctionBase,onComplete?:Delegates.Action0)
  {
      super();
      this.targetAttribute=targetAttribute;
      this.beginTime=begintime;
      this.duration=duration;
      this.onComplete=onComplete;
      this.easingFunction=easing;
      this.beginValue=this.targetAttribute.Converter.FromInterface(beginValue);
      this.endValue=this.targetAttribute.Converter.FromInterface(endValue);
  }

  /**
  * Upate
  */
  public update(time:number):boolean
  {
    var progress=(time-this.beginTime)/this.duration;
    var isFinish=progress>=1;
    progress=Math.min(Math.max(progress,0),1);//clamp [0,1]
    this.updateAnimation(progress);
    if(isFinish&&this.onComplete)this.onComplete();
    return isFinish;
  }

  protected updateAnimation(progress:number):void
  {

  }
}

export=AnimaterBase;
