import Timer = require("./Timer");

class ContextTimer extends Timer {
    public updateTimer(): void {
        this.currentFrame++;
        var date: number = Date.now();
        this.TimeFromLast = date - this.Time;
        this.time = date;
    }
}

export =ContextTimer;
