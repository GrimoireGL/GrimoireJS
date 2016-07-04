import IDObject from "../Base/IDObject";
import LoopManager from "./LoopManager";
class Timer extends IDObject {

    public static instance: Timer;

    public currentFrame: number = 0;

    public time: number = 0;

    public timeFromLast: number = 0;

    private _initializedTime: number = 0;

    constructor() {
        super();
        this._initializedTime = Date.now();
        LoopManager.addAction(1000, () => this.updateTimer());
    }

    public updateTimer(): void {
        this.currentFrame++;
        const currentTime: number = Date.now() - this._initializedTime;
        this.timeFromLast = currentTime - this.time;
        this.time = currentTime;
    }
}

Timer.instance = new Timer();

export default Timer.instance;
