import JThreeObject = require("../Base/JThreeObject");
import IContextComponent = require("../IContextComponent");
import ContextComponent = require("../ContextComponents");
class Timer extends JThreeObject implements IContextComponent
{
    public getContextComponentIndex()
    {
      return ContextComponent.Timer;
    }

    public updateTimer(): void {
        this.currentFrame++;
        var date: number = Date.now();
        this.TimeFromLast = date - this.Time;
        this.time = date;
    }

    constructor()
    {
        super();
    }

    protected currentFrame: number = 0;

    protected time: number = 0;

    protected timeFromLast: number = 0;

    public get CurrentFrame(): number
    {
        return this.currentFrame;
    }

    public get Time(): number
    {
        return this.time;
    }

    public get TimeInSecound():number
    {
      return this.time / 1000;
    }

    public get TimeFromLast(): number
    {
        return this.timeFromLast;
    }
}

export=Timer;
