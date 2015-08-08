import VMDFrameData = require("./VMDFrameData");

interface VMDMotion extends VMDFrameData
{
    frameNumber: number;
    position: number[];
    rotation: number[];
    interpolation: Uint8Array;
}

export =VMDMotion; 