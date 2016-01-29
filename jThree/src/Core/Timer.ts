import JThreeObject from "../Base/JThreeObject";
import IContextComponent from "../IContextComponent";
import ContextComponent from "../ContextComponents";
class Timer extends JThreeObject implements IContextComponent {


  public currentFrame: number = 0;

  public time: number = 0;

  public timeFromLast: number = 0;

  private _initializedTime: number = 0;

  constructor() {
    super();
    this._initializedTime = Date.now();
  }

  public getContextComponentIndex() {
    return ContextComponent.Timer;
  }

  public updateTimer(): void {
    this.currentFrame++;
    const currentTime: number = Date.now() - this._initializedTime;
    this.timeFromLast = currentTime - this.time;
    this.time = currentTime;
  }

}

export default Timer;
