import JThreeObject from "../Base/JThreeObject";
import IContextComponent from "../IContextComponent";
import ContextComponent from "../ContextComponents";
class Timer extends JThreeObject implements IContextComponent {
  public getContextComponentIndex() {
    return ContextComponent.Timer;
  }

  public updateTimer(): void {
    this.currentFrame++;
    const currentTime: number = Date.now() - this._initializedTime;
    this.timeFromLast = currentTime - this.time;
    this.time = currentTime;
  }

  constructor() {
    super();
    this._initializedTime = Date.now();
  }

  private _initializedTime: number = 0;

  public currentFrame: number = 0;

  public time: number = 0;

  public timeFromLast: number = 0;
}

export default Timer;
