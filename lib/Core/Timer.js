import ContextComponents from "../ContextComponents";
import JThreeObject from "../Base/JThreeObject";
import JThreeContext from "../JThreeContext";
class Timer extends JThreeObject {
    constructor() {
        super();
        this.currentFrame = 0;
        this.time = 0;
        this.timeFromLast = 0;
        this._initializedTime = 0;
        this._initializedTime = Date.now();
        const loopManager = JThreeContext.getContextComponent(ContextComponents.LoopManager);
        loopManager.addAction(1000, () => this.updateTimer());
    }
    getContextComponentIndex() {
        return ContextComponents.Timer;
    }
    updateTimer() {
        this.currentFrame++;
        const currentTime = Date.now() - this._initializedTime;
        this.timeFromLast = currentTime - this.time;
        this.time = currentTime;
    }
}
export default Timer;
