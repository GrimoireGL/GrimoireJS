import VMDFrameData = require("./VMDFrameData");
import BezierCurve = require("./BezierCurve");
interface VMDMotion extends VMDFrameData
{
    frameNumber: number;
    position: number[];
    rotation: number[];
    interpolation: BezierCurve[];
}

export =VMDMotion;
