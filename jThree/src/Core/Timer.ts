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

    get CurrentFrame(): number
    {
        return this.currentFrame;
    }

    get Time(): number
    {
        return this.time;
    }

    get TimeFromLast(): number
    {
        return this.timeFromLast;
    }
}

export=Timer;
