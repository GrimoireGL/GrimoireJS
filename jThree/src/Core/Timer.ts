import JThreeObject = require("../Base/JThreeObject");

class Timer extends JThreeObject
{
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

    public get TimeFromLast(): number
    {
        return this.timeFromLast;
    }
}

export=Timer;
