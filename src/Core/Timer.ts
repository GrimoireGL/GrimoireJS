import ContextComponents from "../ContextComponents";
import IDObject from "../Base/IDObject";
import IContextComponent from "../IContextComponent";
import LoopManager from "./LoopManager";
import Context from "../Context";


class Timer extends IDObject implements IContextComponent {


  public currentFrame: number = 0;

  public time: number = 0;

  public timeFromLast: number = 0;

  private _initializedTime: number = 0;

  constructor() {
    super();
    this._initializedTime = Date.now();
    const loopManager = Context.getContextComponent<LoopManager>(ContextComponents.LoopManager);
    loopManager.addAction(1000, () => this.updateTimer());
  }

  public getContextComponentIndex(): number {
    return ContextComponents.Timer;
  }

  public updateTimer(): void {
    this.currentFrame++;
    const currentTime: number = Date.now() - this._initializedTime;
    this.timeFromLast = currentTime - this.time;
    this.time = currentTime;
  }

}

export default Timer;
